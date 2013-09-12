require 'set'

members = Set.new
threads = []

100.times do |n|
  threads << Thread.new do
    if n % 2 == 0
      members << n
    else
      members.first.nil?
    end
  end
end

threads.each(&:join)