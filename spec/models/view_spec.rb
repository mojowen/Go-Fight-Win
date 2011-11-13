require 'spec_helper'

describe View do
  before :each do
    @list = Factory(:list)
  end
  it 'requires a name' do
    @view = View.new(:list => @list)
    @view.save.should be_false
  end
  it 'requires a unique name' do
    @view = View.new(:list => @list, :name => 'unique!')
    @view2 = View.new(:list => @list, :name => 'unique!')
    @view.save
    @view2.save.should be_false
  end  
  it 'must have a list' do
    @view = View.new(:name => 'a view')
    @view.save.should be_false
  end
  it 'creates a slug when creating a new view that is 3 characters long' do
    @view = View.new(:name => 'a view', :list => @list)
    @view.save
    View.first.slug.length.should.equal? 3
  end
  it 'has a unique slug inside of a list (creates a new slug if already taken)' do
    @view = View.new(:name => 'a view', :list => @list)
    @view.save
  end
  it 'serializes sorts, groups, filters, columns' do
    @view = Factory(:view)
    serialized_fields = ['sorts','groups','filters','columns']
    serialized_fields.each do |s|
      @view[s] = ['first',{:nested => 'val'}]
      @view.save
      View.first[s][0].should.equal? 'first'
      View.first[s][1][:nested].should.equal? 'val'
    end
  end
  
end
