---
title: Homelab Step 0 - Install CentOS
tags:
  - Homelab
date: '2020-07-06T13:17:02.732Z'
categories:
  - notes
  - homelab
---

最近准备搭建一个 Homelab，用来方便生活&方便学习。在考虑购入合适硬件的同时，不妨用手头更新换代闲置的旧 PC 来先做一下尝试。我的旧 PC 当年配置尚可，相信现在还是可以胜任一个入门 Homelab 来耍耍。

首先在闲置 PC 上安装 CentOS 系统，同时移除不再使用的 Windows 系统。

<!-- more -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [准备工作](#准备工作)
- [下载 CentOS 系统镜像](#下载-centos-系统镜像)
- [将系统镜像写入 U 盘](#将系统镜像写入-u-盘)
- [安装 CentOS 系统](#安装-centos-系统)
- [链接 WIFI](#链接-wifi)
- [同步时间](#同步时间)
- [配置 SSH key](#配置-ssh-key)

## 准备工作

在开始安装 CentOS 到旧 PC 之前，先确保下面这些准备工作已经完成。

- 确定旧 PC 可以正常工作
- 准备一个 U 盘用来刻录系统镜像
- 事先备份好 PC 上到重要数据
- 准备一根网线连接你的路由器

装机的介质我选择了 U 盘，这是为了进行 clean 安装（全盘格式化，删除旧系统）而准备的。除了 U 盘之外，如果你有一个 DVD 光驱，你也可以用光盘来替代。

同样的，我们将进行全盘格式化清洁安装系统，所以先确保 PC 上的重要数据全都做好了备份。避免数据丢失造成不必要的损失。

同时我们还需要一根网线用来确保网络。CentOS 8 在装机之后 WIFI 并不能开箱即用，需要联网安装 `NetworkManager-wifi` 工具启动。

## 下载 CentOS 系统镜像

从 CentOS 官网下载最新的系统镜像文件。

https://www.centos.org/download/

选择想安装的系统版本，选择合适的 mirror 链接下载，阿里云的就不错。在下载 ISO 文件时注意选择 DVD1 ISO，这个版本还包括一些方便的 packages 可以顺便安装，建议大部分用户选择。（[为什么？点我查看](https://docs.centos.org/en-US/8-docs/standard-install/assembly_preparing-for-your-installation/#downloading-beta-installation-images_preparing-for-your-installation)）

这里我选择的是 CentOS-8.2.2004。文件大小 8G，不过 mirror 站网速不错，下载只用了几分钟时间。

## 将系统镜像写入 U 盘

准备一个至少 16G 的 U 盘，将 CentOS 系统 ISO 文件写入其中，制作成一个装机盘。这需要一个刻录工具，如果你没有合适的刻录工具，在 Windows 平台，官方推荐 [Fedora Media Writer](https://github.com/FedoraQt/MediaWriter/releases) 来完成装机 U 盘的制作。

刚好我没有一个合适的刻录工具 😂，而且 U 盘只能在 Windows 下被识别，所以尝试了一下 Fedora Media Writer。步骤属于傻瓜操作。

- 下载 Win 平台 Fedora Media Writer 安装程序并进行安装

> https://github.com/FedoraQt/MediaWriter/releases

- 启动 Fedora Media Writer 选择 [自定义镜像]

![fedora_media_writer](/images/notes/homelab/fedora_media_writer.jpg)

- 在弹出框中找到上面下载的 CentOS 系统镜像，我这里是 `CentOS-8.2.2004-x86_64-dvd1.iso`
- 在接下来的菜单中选择插入的 U 盘，点击 [写入磁盘] 开始刻录

![write_to_flash_driver](/images/notes/homelab/write_to_flash_driver.jpg)

等待一会，刻录完成即可开始安装系统。

## 安装 CentOS 系统

将 U 盘插入闲置 PC，开机进入 BIOS，选择 USB Storage Device 启动。不出意外的话，将正常进行 CentOS 系统的安装。

安装界面是一个 GUI，可以根据需求定制一下安装过程。

**移除旧 Windows 系统**

操作前请先做好数据备份（如果有关键数据的话）。CentOS 选择挂载硬盘时，选择对硬盘进行 reclaim，清除所有数据。这样，旧 Windows 系统将直接被删除。

由于只是一次尝试，安装过程就基本按照默认设置来了，在 GUI 界面可以设置一下 WIFI 链接，方便后面操作。当然掠过也无所谓，可以使用 `nmuti` 进行配置。

Homelab 不需要一个 GUI，所以在安装选项上我选择了不带 GUI 的 server。

总结一下，主要配置完下面的内容，就可以进入安装阶段了。

- 安装内容（server without GUI）
- 挂载硬盘（reclaim 所有空间进行 clean 安装）
- 语言和时间设置

安装阶段可以对 root 用户设置密码。然后，稍等片刻，安装很快就会结束。

## 链接 WIFI

先准备一根网线，连接机器和路由器，保证网络。

对我来说始终连接网线不太方便，我的机器存在无线网卡，所以决定出于方便这台实验性质的 Homelab 就使用 WIFI 联网。

CentOS 的 WIFI 并非开箱即用，所以我们需要先保证网络。网络畅通的情况下输入下面的命令安装 WIFI 组件。

```console
$ sudo yum install NetworkManager-wifi
```

安装完成后 `reboot` 一次，拔掉网线，WIFI 将会自动连接。

> 如果 WIFI 不稳定，可以换成有线连接，此时需要手动关闭 WIFI 连接。可以输入下面命令。
>
> ```console
> $ nmcli radio wifi off
> ```

## 同步时间

本地时间与互联网时间不同步会造成部分在线服务无法访问。在 CentOS 8 中与互联网同步时间需要手动设置。

首先保证时间同步工具 `chrony` 已经安装。

```console
$ dnf install -y chrony
```

> CentOS 8 中 dnf 代替 yum 成为默认包管理工具。不过 yum 依旧可以使用。

确保工具安装之后，编辑一下配置文件，将时间同步服务器修改为国内地区服务器来加快访问速度。

```console
$ vi /etc/chrony.conf
```

将第一行替换为 `pool ntp.ntsc.ac.cn iburst`。

启动自动同步时间。

```console
$ systemctl enable chronyd
$ systemctl start chronyd
```

稍等片刻，时间将会自动与服务器进行同步。

## 配置 SSH key

为了方便常用机连接 Homelab 进行操作，可以将常用机的 SSH key 添加到 Homelab 对应用户的 authorized_keys 中以方便登陆。设置完成之后登陆不再需要密码。

> 不需要密码就可以登陆 Homelab，意味着任何人使用你的账号都可以访问到你的服务器，请谨慎考虑其中的风险，不建议在公共机器进行这个设定。

首先需要准备一个 SSH key。如果你使用 Github 或者类似的 git 仓库，那么应该存在一个 SSH key 在你的用户文件夹中。所以先检查 SSH key 是否存在。

```console
$ ls -l ~/.ssh

# or in windows
$ ls c:\users\<username>\.ssh
```

如果你看到一个 `id_rsa.pub` 或者其他以 `.pub` 结尾的文件存在，这就是你的 SSH key 了，你可以选择复用它，也可以用下面命令重新生成一个。

```console
$ ssh-keygen -t rsa -b 2048
```

> 生成新的 SSH key 时会提示你选择 key 储存的位置和密码，可以根据需求设置。密码可以留空，表示不需要使用密码。

先看看 SSH key 的内容。等下需要使用到，可以考虑临时保存一下。

```console
$ cat ~/.ssh/id_rsa.pub
```

SSH key 内容应该是以 `ssh-rsa` 开始，以你设定到邮箱结尾的一串文本。接下俩我们将其添加到 Homelab 上。

先使用开发机用密码远程登陆 Homelab。注意 `@` 后面的主机地址，我这里用 `homelab` 指代，实际上这里应该填写主机的局域网地址。以后我们也会将 Homelab 绑定到固定到域名上方便我们访问，目前我们还是局域网内访问。

```console
$ ssh root@homelab
```

在输入密码完成登陆后，我们在希望免密码登陆的用户的目录下面添加 `authorized_keys` 文件。

```console
$ touch ~/.ssh/authorized_keys

# copy your ssh key and paste it into this file
$ vim ~/.ssh/authorized_keys
```

将开发机的 SSH key 添加到这个文件并保存。

退出当前登陆，重新尝试一次 SSH 登陆。

```console
$ exit
$ ssh root@homelab
```

如果这里不再提示密码，则表示配置成功。

> 配置 SSH key 还可以方便 VS Code 远程访问 Homelab，以方便编辑配置文件。

到此 CentOS 的安装和配置就完成了。
