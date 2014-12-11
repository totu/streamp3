# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.define :web do |web_config|
    web_config.vm.box = "precise64"
    web_config.vm.box_url = "http://files.vagrantup.com/precise64.box"
    web_config.vm.network :private_network, ip: "66.66.66.66"
    web_config.vm.network :forwarded_port, guest: 80, host: 9000

    web_config.vm.hostname = "nodebox"

    web_config.vm.provider :virtualbox do |vb|
      vb.customize ["modifyvm", :id, "--memory", "2048"]
    end

    web_config.vm.provision :ansible do |ansible|
      ansible.playbook = "devops/user.yml"
      ansible.inventory_path = "devops/webhosts"
      ansible.limit = 'all'
      ansible.verbose = "vvvv"
      ansible.sudo = true
      ansible.extra_vars = { ansible_ssh_user: 'vagrant' }
    end

  end


end
