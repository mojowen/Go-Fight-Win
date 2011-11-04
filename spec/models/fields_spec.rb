require 'spec_helper'

describe Field do
  before :each do
     @field = Factory(:field)
  end

   it "Cannot save field without a list" do
     @field[:list_id] = nil
     @field.save.should be_false
   end

   it "Cannot save field without field type" do
     @field[:field_type] = nil
     @field.save.should be_false
   end

   it "Cannot save field without name" do
     @field[:name] = nil
     @field.save.should be_false
   end

   it "Cannot save field with duplicate name as other field" do
     @field.save
     @diff_field = @field.list.fields.new
     @diff_field.name = @field.name
     @diff_field.save.should be_false
   end
   
   it 'serializes field options' do
     data = {:one => 'first', :two => 'second'}
     @field.field_options = data
     @field.save
     Field.find(@field).field_options[:one].should.equal? data[:one]
   end


end
