source 'http://rubygems.org'

gem 'rails', '3.1.1'

# Bundle edge Rails instead:
# gem 'rails',     :git => 'git://github.com/rails/rails.git'

group :production do
  gem 'pg'
end
group :development, :test do
  gem 'sqlite3'
end

gem 'to_xls', '~> 1.0.0'
gem 'thin'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.1.4'
  gem 'coffee-rails', '~> 3.1.1'
  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'
gem 'devise'
gem 'omniauth', '~> 0.3.2'
gem 'cancan'

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'





# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

#group :test do
  # Pretty printed test output
  #gem 'turn', :require => false
#end

gem "rspec-rails", :group => [:test, :development]
group :test do
  gem "factory_girl_rails"
  gem "capybara"
  gem 'launchy'
  gem 'database_cleaner'
  gem "guard-rspec"
  gem 'growl'
  gem 'jasmine'
  gem 'jasmine-headless-webkit', :git => 'https://github.com/johnbintz/jasmine-headless-webkit.git'
  gem 'guard-jasmine-headless-webkit', :git => 'git://github.com/johnbintz/guard-jasmine-headless-webkit.git'
  gem 'guard-rails-assets'
end