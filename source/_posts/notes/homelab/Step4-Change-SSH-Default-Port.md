---
title: Homelab Step 4 - Change SSH Default Port
tags:
  - Homelab
date: "2020-07-30T13:17:02.732Z"
---

Homelab 使用一段时间，有时 ssh 登陆上去会提示这样一段信息。

> There were xxxxx failed login attempts since the last successful login.

这说明有不明身份的人正在尝试暴力破解我们的 root 用户密码。通常是黑客的 robot 程序在寻找容易入侵的机器。

出于安全考虑，也想避开这些烦人的警告，可以采取一些措施。

<!-- more -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [基础措施](#基础措施)
- [修改 sshd 配置](#修改-sshd-配置)
- [修改 SELinux 配置](#修改-selinux-配置)
- [配置 Firewalld](#配置-firewalld)
- [重启 sshd 使配置生效](#重启-sshd-使配置生效)

## 基础措施

- 使用 ssh key 认证，避免使用密码认证

如果确定从固定的机器访问我们的 Homelab 的话，可以在常用机器上配置 ssh key，关闭密码认证通道。这样可以有效保障服务器安全。

- 使用强密码，修改默认端口

不过如果希望从任何机器都能访问，ssh key 显然不够方便。这时可以更换默认的端口，并且避免使用弱密码，应该设置强密码。

> 这种方法并没有提高安全性，所以强密码是必须的。修改默认端口号只是降低了被 robot 暴力破解的风险，毕竟大部分暴力破解脚本是针对默认的 22 端口尝试破解的。

这里我选择第二种方式。

> 配置 ssh key 过程比较简单，麻烦之处在于要将 key 复制到各个机器上。出于安全考虑建议此方法。

## 修改 sshd 配置

首先修改 sshd 端口。

Homelab 上编辑配置文件。

```console
$ vi /etc/ssh/sshd_config
```

打开配置文件后，找到这一行。

```
#Port 22
```

取消注释，将端口号改成想要的端口，比如这里将其改为 `2222`。

```
Port 2222
```

退出保存配置。

## 修改 SELinux 配置

SELinux 会阻止未经配置的程序绑定对应端口。所以需要配置告诉 SELinux 我们已经修改 ssh 的端口，让其允许 sshd 绑定到对应的端口上。

> 是不是很绕？

来看看 ssh 默认的端口。

```console
$ semanage port -l | grep ssh
ssh_port_t                     tcp      22
```

看到是默认 22 端口。将新定义的 2222 端口配置给它。

```console
$ sudo semanage port -a -t ssh_port_t -p tcp 2222
```

简单 check 一下。

```console
$ semanage port -l | grep ssh
ssh_port_t                     tcp      2222, 22
```

可以看到配置完成了。

> 还没完。

## 配置 Firewalld

修改完 ssh 默认端口，配置完 SELinux 允许其绑定端口。最后，还要允许这个端口通过防火墙，这样才能正常从外部进行访问。

直接添加端口允许流量通过。

```console
$ sudo firewall-cmd --add-port=2222/tcp --permanent
$ sudo firewall-cmd --reload
```

## 重启 sshd 使配置生效

最后重启 sshd 即可生效。

```console
$ systemctl restart sshd
```

这时从外部使用 2222 端口已经可以访问到 Homelab。

```console
$ ssh -p 2222 root@homelab
```

> 路由器可能需要相关配置，将 2222 端口流量转发到 Homelab 上。

Finished。
