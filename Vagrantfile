# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

def box_setup(config, ip, playbook, inventory)
  config.vm.network :private_network, ip: ip
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = playbook
    ansible.inventory_path = inventory
    ansible.host_key_checking = false
    # ansible.verbose = "vvv"
  end
end

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
    box_setup stage, \
      "10.9.8.31", "deploy/playbook_nginx.yml", "deploy/hosts/vagrant_stage.yml"
    stage.vm.synced_folder "./", "/vagrant", disabled: true
  end
end
