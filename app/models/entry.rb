class Entry < ActiveRecord::Base
  belongs_to :item
  belongs_to :field
  validates_presence_of :data, :item_id, :field_id

  before_create :match_and_deactivate
  
  def match_and_deactivate
    match = Entry.find_by_item_id_and_field_id_and_active(self.item_id, self.field_id, self.active)
    unless match.nil?
      match.destroy
    end
  end

end

