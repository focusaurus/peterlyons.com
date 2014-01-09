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
  config.vm.box = "ubuntu13.10amd64"
  config.vm.box_url = "http://cloud-images.ubuntu.com/vagrant/saucy/current/saucy-server-cloudimg-amd64-vagrant-disk1.box"
  config.ssh.forward_agent = true
  # development box intended for ongoing development
  config.vm.define "build", primary: true do |build|
    box_setup build, \
      "10.9.8.20", "deploy/playbook_build.yml", "deploy/hosts/vagrant_build.yml"
  end
  # stage box intended for configuration closely matching production
  config.vm.define "stage" do |stage|
    box_setup stage, \
      "10.9.8.21", "deploy/playbook_nginx.yml", "deploy/hosts/vagrant_stage.yml"
    stage.vm.synced_folder "./", "/vagrant", disabled: true
  end
end
