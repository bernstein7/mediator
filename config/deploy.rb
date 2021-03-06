# config valid only for current version of Capistrano
lock '3.3.5'

set :application, 'mediator'
set :repo_url, 'git@github.com:bernstein7/mediator.git'
set :rvm_type, :user                     # Defaults to: :auto
set :rvm_ruby_version, '2.2.0'      # Defaults to: 'default'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, '/var/www/my_app_name'

# Default value for :scm is :git
set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'public/media')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }
set :default_env, { rvm_bin_path: '~/.rvm/bin' }
# SSHKit.config.command_map[:rake] = "#{fetch(:default_env)[:rvm_bin_path]}/rvm ruby-#{fetch(:rvm_ruby_version)} do bundle exec rake"
# Default value for keep_releases is 5
set :keep_releases, 5

namespace :deploy do

  desc 'Start application'
  task :start do
    on roles(:app), in: :sequence, wait: 5 do
      execute "cd #{fetch(:deploy_to)}/current && ~/.rvm/bin/rvm 2.2.0 do bundle exec thin -S #{fetch(:socket_path)} -e staging -d start"  ## -> line you should add

      # execute "cd #{fetch(:deploy_to)}/current && bundle exec thin -S #{fetch(:socket_path)} start"  ## -> line you should add
    end
  end

  desc 'Restart application'
  task :restart do
    on roles(:app) do
      within release_path do
        execute "cd #{fetch(:deploy_to)}/current && ~/.rvm/bin/rvm 2.2.0 do bundle exec thin -S #{fetch(:socket_path)} -e staging -d restart"  ## -> line you should add
      end
    end
  end

  desc 'Stop application'
  task :stop do
    on roles(:app) do
      within release_path do
        execute "cd #{fetch(:deploy_to)}/current && ~/.rvm/bin/rvm 2.2.0 do bundle exec thin -e staging stop"  ## -> line you should add
      end
    end
  end

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

  after :publishing, :restart

end
