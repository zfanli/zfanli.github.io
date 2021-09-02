---
title: Homelab Step 2 - Enable DDNS
tags:
  - Homelab
date: '2020-07-08T13:17:02.732Z'
categories:
  - notes
  - homelab
---

国内宽带环境个人用户很难拿到固定公网 IP。不过如果你没有公网 IP，通过联系电信运营商的客服，还是可以拿到公网动态 IP 的。

> 具体也要看运营商的情况。

确保公网 IP 是 DDNS 的前提。使用 DDNS，可以将 IP 动态绑定到对应的域名上，可以保证域名随时都能访问到我们的 Homelab 机器。

所以，你也知道了，要域名的。（散了散了！）

<!-- more -->

## 准备工作

保证这些东西都准备好就可以开始进行配置了，让我们的域名随时都处于可访问的状态。

- 准备好域名
- 确保 WAN 口能拿到公网 IP
- 设置路由器端口映射暴露 Homelab 必要的端口

### 参考

> 待整理。

DDNS script repo。

https://github.com/zfanli/ddns-aliyun

crontab

```shell
$ crontab -u username /etc/crontab

$ crontab -l -u username
```
