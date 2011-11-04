require 'spec_helper'

describe MembershipsController do
  before :each do
    @org = Factory(:org)
    @membership = Factory(:membership, :org => @org )
  end
  
  describe 'while admin signed in' do
    before :each do
      @admin = login_admin(@org)
    end
      describe "GET 'destroy'" do
        it "returns redirect to org path" do
          get 'destroy', :org_id => @org.id, :membership => @membership.id
          response.should redirect_to org_path @org.to_param
        end
        it 'should recognize destroy route' do
          destroy_membership_path(@org.id, @membership.id).should == '/'+@org.id.to_s+'/~/'+@membership.id.to_s+'/destroy'
        end
      end

      describe "GET 'update'" do
        it 'reutrns redirect to org path' do
          get 'update', :org_id => @org.id, :membership => @membership.id
          response.should redirect_to org_path @org.to_param
        end
        it 'should recognize update route' do
          update_membership_path(@org.id, @membership.id).should == '/'+@org.id.to_s+'/~/'+@membership.id.to_s+'/update'
        end
      end
    end
  describe 'while not logged in' do
    
    describe 'GET "invite" method' do
        before :each do
          @invite = Factory(:membership, :org => @org, :invite_token => 'bloopbleep', :approved => true)
        end
        it 'returns http success' do
          get 'invite', :org_id => @org.id, :invite_token => @invite.invite_token
          response.should be_redirect
        end
        it 'should recognize invite route' do
          invite_membership_path(@org.id, @invite.invite_token).should == '/'+@org.id.to_s+'/~/invite/'+@invite.invite_token
        end
    end

  end

end
