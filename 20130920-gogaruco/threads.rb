require 'set'

members = Set.new
threads = []

50.times do |n|
  if n % 2 == 0
    threads << Thread.new do
      members << n
    end
  else
    threads << Thread.new do
      members.first * 2
    end
  end
end

threads.each(&:join)