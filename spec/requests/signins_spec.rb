require 'spec_helper'

include Devise::TestHelpers

describe "Signins" do

  describe "Basic User interactions" do
    
    it "can sign in and out" do
      user = Factory(:user)
      sign_in_by_hand(user)
      page.should have_content("Signed in successfully")
      sign_out_by_hand
      page.should have_content('Signed out successfully')
    end
    
    it 'can register for an account and cancel that account' do
      user = Factory(:user)
      User.find_by_email(user.email).destroy unless User.find_by_email(user.email).nil?
      visit new_user_registration_path
      fill_in "user_email", :with => user.email
      fill_in "user_password", :with => user.password
      fill_in "user_password_confirmation", :with => user.password_confirmation
      click_button 'Sign up'
      page.should have_content("Welcome! You have signed up successfully")
      visit edit_user_registration_path
      click_link 'Cancel my account'
      page.should have_content('Bye! Your account was successfully cancelled')
    end

  end
  
end
