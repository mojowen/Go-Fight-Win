Factory.define :user do |f|
  f.sequence(:email) { |n| "foo#{n}@example.com" }
  f.password "secret"
  f.password_confirmation { |u| u.password }
end

Factory.define :org do |f|
  f.sequence(:name) {|n| "foo #{n}" }
end

Factory.define :membership do |f|
  f.association :user
  f.association :org
  f.approved true
end
