Factory.define :user do |f|
  f.sequence(:email) { |n| "foo#{n}@example.com" }
  f.password "secret"
  f.password_confirmation { |u| u.password }
end

Factory.define :authentication do |f|
  f.provider "twitter"
  f.association :user
end

Factory.define :org do |f|
  f.sequence(:name) {|n| "foo #{n}" }
end

Factory.define :membership do |f|
  f.association :user
  f.association :org
  f.approved true
end

Factory.define :list do |f|
  f.sequence(:name) {|n| "list biatch #{n}" }
  f.association :org
  f.active true
end

Factory.define :field do |f|
  f.sequence(:name) {|n| "field biatchs #{n}" }
  f.association :list
  f.active true
  f.field_type 'text'
end

Factory.define :item do |f|
  f.active true
  f.association :list
end

Factory.define :entry do |f|
  f.active true
  f.association :item
  f.association :field
  f.sequence(:data) {|n| "data biatchs #{n}" }
end

Factory.define :view do |f|
  f.active true
  f.sequence(:name) {|n| "view biatchs #{n}" }
  f.association :list
end

