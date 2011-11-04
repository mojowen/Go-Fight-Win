require 'spec_helper'


describe AuthenticationsController do
  before :each do
    @user = login_user
    @authentication = Factory(:authentication, :user => @user)
  end
  
  describe "GET 'index' " do
    before :each do
      login_user
      get 'index'
    end
    it 'returns http success' do
      response.should be_success
    end
    it 'returns active authentications when logged in' do
      should assigns(@authentication)
    end
  end
  
  describe "GET 'new_auth'" do
    it 'recognizes twitter auth route' do
      new_auth_path('twitter') == '/auth/twitter/callback'
    end
    it 'recognizes twitter auth route' do
      new_auth_path('google') == '/auth/google/callback'
    end
    it 'recognizes twitter auth route' do
      new_auth_path('facebook') == '/auth/facebook/callback'
    end
  end
  
  describe "DELETE 'destroy'" do
    before :each do
      get 'destroy', :id => @authentication.id
    end
    it 'should redirect to authentications' do
      response.should redirect_to(authentications_path)
    end
  end
  
end