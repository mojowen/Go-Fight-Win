class AddReporttoViews < ActiveRecord::Migration
  def up
    add_column :views, :report_on, :string
  end

  def down
  end
end
