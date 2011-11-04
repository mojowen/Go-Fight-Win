require 'spec_helper'

describe Entry do
  before :each do 
    @entry = Factory(:entry)
  end
  
  it 'cannot save without data' do
    @entry.data = nil
    @entry.save.should be_false
  end
  it 'cannot save without data' do
    @entry.item_id = nil
    @entry.save.should be_false
  end
  it 'cannot save without data' do
    @entry.field_id = nil
    @entry.save.should be_false
  end
  
  it 'cannot save a duplicate of itself' do
    @entry.save
    Entry.new(:data => @entry.data, :field_id => @entry.field_id, :item_id => @entry.item_id ).save
    Entry.find_all_by_field_id_and_item_id_and_data(@entry.field_id, @entry.item_id, @entry.data).count.should.equal? 1
  end
  
end


