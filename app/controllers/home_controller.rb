class HomeController < ApplicationController
  def index
  end

  def notice
    @dsd = true
    notice = nil
  end
end
