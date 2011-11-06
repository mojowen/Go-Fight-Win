require 'spec_helper'

describe Row do
  it 'has a key' do
    @item = Factory(:item)
    @row = Row.new(@item)
    @row.key.should.equal? @item.id
  end
  
  it 'has a list' do
    @item = Factory(:item)
    @row = Row.new(@item)
    @row.list.should.equal? @item.list.name
  end
  
  describe 'having a field named key does not overwrite the key' do
    before :each do
      @list = Factory(:list)
      @field = Factory(:field, :name => 'key', :list => @list )
      @item = Factory(:item, :list => @list)
      @row = Row.new(@item)
    end
    it 'still returns key as normal' do
      @row.key.should.equal? @item.id
    end
    it 'returns "" for the field named key' do
      field_name = @field.name+'_'+@field.id.to_s
      @row[field_name].should == ''
    end
    it 'returns field value if passed when creating field named key' do
      field_name = @field.name+'_'+@field.id.to_s
      @row = Row.new(:key => @item, field_name => 'ooga')      
      @row[field_name].should.equal? 'ooga'
    end
  end
  
  describe 'having a normal field name' do
    before :each do
      @list = Factory(:list)
      @field = Factory(:field, :list => @list )
      @item = Factory(:item, :list => @list)
    end
    it 'returns field value if passed a non weird name' do
      @row = Row.new(:key => @item, @field.name => 'ooga')      
      @row[@field.name].should.equal? 'ooga'
    end
  end
  
  describe 'loading entry data into a field name' do
    before :each do
      @list = Factory(:list)
      @field = Factory(:field, :list => @list )
      @item = Factory(:item, :list => @list)
      @entry = Factory(:entry, :item => @item, :field => @field )
    end
    it 'matches entry data to row value by field' do
      @row = Row.new(@item)
      @row[@field.name].should.equal? @entry.data
    end
    it 'supercedes entry data when given it in the parameters' do
      @row = Row.new({:item => @item, @field.name => 'better data'})
      @row[@field.name].should.equal? 'better data'
    end
  end
  
  describe 'saving a row and create new entries' do
    before :each do
      @list = Factory(:list)
      fields = []
      5.times do
        fields.push(Factory(:field, :list => @list ))
        fields.last.save
      end
      it 'saving blank row with a list and params creates new entry' do
        Row.new(:list => @list, fields.first.name => 'thing').save
        Entry.last.data.should.equal? 'thing'
      end
      it 'saving blank row with a list and params creates many new entries' do
        Row.new(:list => @list, fields.first.name => 'thing', fields[1].name => 'thing', fields[2].name => 'thing2', fields.last.name => 'thing3', ).save
        Entries.count.should.equal? 4
      end
      it 'saving row will replace an entry if exists params creates new entry' do
        @item = Factory(:item, :list => @list)
        @item.save
        Factory(:entry, :item => @list, :field => fields.first, :data => 'poop' ).save
        Row.new(:item => @item, fields.first.name => 'thing').save
        Entry.find_by_item_id_and_field_id(@item.id, fields.first.id).data.should.equal? 'thing'
      end
      it 'Saving a _tempkey will return the _tempkey' do
        @tempkey = 5
        Row.new(:list => @list, fields.first.name => 'thing', '_tempkey' => @fixnum ).save[:_tempkey].should.equal? @tempkey
      end
      it 'Can save a blank row and will create a new item' do
        Row.new(:list => @list).save[:key].should.equal? Item.last.id
      end
      describe 'parnet lists' do
        before :each do
          @child = Factory(:list, :parent => @list)
        end
        it 'When saving any rows will fill-in rows' do
          Row.new(:list => @child).save
          Item.all.count.should.equal? 2
        end
        it 'When saving a row will create parent item that connects to parent list' do
          Row.new(:list => @child, fields.first.name => 'thing thing').save
          @list.save
          puts Entry.last.item.list_id
          puts @list.id
          Entry.last.item.list_id.should.equal? @list.id
        end
        it 'When saving a row will create child item that connects to parent item' do
          Row.new(:list => @child, fields.first.name => 'thing thing').save
          @child.items.last.parent.should.equal? @list.items.last
        end
        it 'Saving a row with a parent creates two items' do
          Row.new(:list => @child).save
          Item.all.count.should.equal? 2
        end
        it 'Saving a row with a parent creates two items, one of which is the parent of the other' do
          Row.new(:list => @child).save
          Item.first.parent.should.equal? Item.last
        end
        
      end
      
    end
    
  end

  
end