require 'spec_helper'

describe Org do
  it 'cannot add shitty orgs without names' do 
    @org = Org.new
    @org.valid?.should == false

    @org.name = "same old"
    @org.save.should == true
  end
  it 'cannot add duplicate names' do
    @org = Factory(:org)
    @new_org = Org.new
    @new_org.name = @org.name
    @org.save
    @new_org.save.should == false
  end
  
  it 'can have parents' do 
    @parent = Factory(:org)
    @parent.save
    @child = Factory(:org, :parent_id => @parent.id )
    @child.parent.should.equal? @parent
  end
  
  it 'has a parents method that includes all parents and doesn\'t include siblings' do
    @grandparent = Factory(:org)
    @grandparent.save

    @parent = Factory(:org, :parent_id => @grandparent.id )
    @parent.save

    @sibling = Factory(:org, :parent_id => @parent.id )
    @sibling.save

    @child = Factory(:org, :parent_id => @parent.id )
    @child.save
    
    #making sure both of the grandparents are 
    @child.parents.include?(@parent).should be_true
    @child.parents.include?(@grandparent).should be_true
    @child.parents.include?(@sibling).should be_false
  end
  
  it 'creates a slug with no spaces that can be used to find it' do
    @org = Factory(:org)
    @org.save
    @org.to_param.include?(' ').should be_false
    Org.find_by_slug(@org.to_param).should.equal? @org
  end
  
  context 'Testing User to Org via membership' do
    before :each do 
      @user = Factory(:user)
      @org = Factory(:org)
    end
    
    it 'does not haves users if membership not approved' do
      @org.memberships.new(:org_id => @org.id).save
      @org.users.first.equal? nil
    end
    
    it 'does have users if membership approved' do 
      @org.memberships.new(:org_id => @org.id, :approved => true).save
      @org.users.first.equal? @user
    end
    
  end
end
