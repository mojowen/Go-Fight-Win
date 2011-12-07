require 'spec_helper'

describe 'Authentications Tests' do  
  
  describe "Adding authentication when already logged in" do

    before(:each) do 
      @user = Factory(:user)
      visit new_user_session_path
      fill_in "user_email", :with => @user.email
      fill_in "user_password", :with => @user.password
      click_button "Sign in"
    end
     
    it "Can authorize Twitter" do
      login_with_oauth
      page.should have_content('12345')
      Authentication.last.user.equal? @user
    end
    
    it 'Can authorize Facebook' do
      login_with_oauth('facebook')
      page.should have_content('98765')
      Authentication.last.user.equal? @user
    end
    
    it 'Signs out and signs back in using auth' do
      login_with_oauth
      visit '/'
      click_link 'sign out'
      login_with_oauth
      page.should have_content(@user.email)
    end
  end
  
 describe 'Can create a new account with authentications' do
   it 'Can sign up using authentications' do
     login_with_oauth
     page.should have_content('Email can\'t be blank')
     fill_in "user_email", :with => 'bull@shit.com'
     click_button 'Sign up'
     page.should have_content("Welcome! You have signed up successfully")
     click_link 'sign out'
   end
 end
end
