#!/bin/bash

sudo steamos-readonly disable
sudo rm /usr/lib/holo/pacmandb/db.lck
sudo rm /etc/ld.so.conf.d/fakeroot.conf
sudo rm -R /var/lib/nordvpn
sudo rm -rf /etc/pacman.d/gnupg/ || :
sudo pacman-key --init
sudo pacman-key --populate
sudo pacman -Sy --noconfirm --needed archlinux-keyring
sudo pacman --noconfirm -S $(pacman -Qnkq | cut -d' ' -f1 | sort | uniq)
sudo pacman --noconfirm -S base-devel multilib-devel --needed
sudo pacman --noconfirm -S fakeroot git
sudo touch /usr/share/steamos/devmode-enable
mkdir /home/deck/nordvpndecky
cd /home/deck/nordvpndecky
git clone https://aur.archlinux.org/nordvpn-bin.git
cd nordvpn-bin
makepkg -si --noconfirm
sudo rm -R /home/deck/nordvpndecky
sudo steamos-readonly enable
sudo usermod -aG nordvpn deck