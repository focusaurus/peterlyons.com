# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # common settings shared by all vagrant boxes for this project
  config.vm.box = "ubuntu/trusty32"
  config.ssh.forward_agent = true
  # development box intended for ongoing development
  config.vm.define "build", primary: true do |build|
    config.vm.network :private_network, ip: "10.9.8.30"
    config.vm.provision "shell", path: "./deploy/provision_build_box.sh"
  end
  # stage box intended for configuration closely matching production
  config.vm.define "stage" do |stage|
    config.vm.network :private_network, ip: "10.9.8.31"
    config.vm.provision "ansible" do |ansible|
      ansible.playbook = "deploy/playbook_nginx.yml"
      ansible.limit = "stage"
      ansible.extra_vars = {
        ansible_ssh_user: 'vagrant',
        hostname: 'stage.peterlyons.com'
      }
      ansible.host_key_checking = false
      # ansible.verbose = "vvv"
    end
    stage.vm.synced_folder "./", "/vagrant", disabled: true
  end
end
