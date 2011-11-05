# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'capybara/rspec'
require "cancan/matchers"



# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

RSpec.configure do |config|
  
  require 'database_cleaner'
  config.before(:suite) do
    DatabaseCleaner.strategy = :truncation
  end

  config.before(:each) do
    DatabaseCleaner.clean
    ## Row uses a class variable that doesn't get reset with rspec, this resets it
    Row.clean
  end
  
  # == Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr
  config.mock_with :rspec


  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = false

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false
  config.include IntegrationSpecHelper, :type => :request
  config.include Devise::TestHelpers, :type => :controller
  
end

Capybara.default_host = 'http://example.org'

OmniAuth.config.test_mode = true
OmniAuth.config.add_mock(:twitter, {
  :uid => '12345',
  :nickname => 'zapnap'
});

OmniAuth.config.add_mock(:facebook, {
  :uid     => "98765", :facebook => {
    :email => "foo1@example.com",
    :gender => "Male",
    :first_name => "foo",
    :last_name => "bar"
}});

def login_admin(org)
  org_id = org.nil? ? nil : org.id
  membership = Factory(:membership,:approved => true, :org_id => org_id, :admin => true )
  user = membership.user
  
  if @request.nil?
    sign_in_by_hand user
  else
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in user
  end
  
end

def login_user(org = nil )
  org_id = org.nil? ? nil : org.id
  membership = Factory(:membership,:approved => true, :org_id => org_id )
  user = membership.user
  
  if @request.nil?
    sign_in_by_hand user
  else
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in user
  end
  return user
end

def sign_in_by_hand(user)
  visit new_user_session_path
  fill_in "user_email", :with => user.email
  fill_in "user_password", :with => user.password
  click_button "Sign in"
end

def sign_out_by_hand
  click_link 'Sign out'
end

