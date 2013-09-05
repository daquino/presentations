require 'set'

members = Set.new
threads = []

50.times do |n|
  threads << Thread.new do
    if n % 2 == 0
      members << n
    else
      members.first.nil?
    end
  end
end

threads.each(&:join)


class ReplicaSetClient
  def initialize
    @nodes = Set.new
  end

...

  def connect_to_nodes
    seed = valid_node
    seed.node_list.each do |host|
      node = Node.new(host)
      @nodes << node if node.connect
    end
  end

  def choose_node(type)
    @nodes.detect { |n| n.type == type }
  end

end


class ReplicaSetClient
  def initialize
    @nodes = Set.new
    @connect_mutex = Mutex.new
  end

...

  def connect_to_nodes
    seed = valid_node
    seed.node_list.each do |host|
      node = Node.new(host)
      @connect_mutex.synchronize do
        @nodes << node if node.connect
      end
     end
  end

  def choose_node(type)
    @connect_mutex.synchronize do
      @nodes.detect { |n| n.type == type }
    end
  end

end


class Pool
...

  def checkout
    loop do
      @lock.synchronize do
        ... # Thread gets its prior socket or creates a socket, else:
        if @available_sockets.size > 0
          socket = @available_sockets.next
          return socket
        end
        @queue.wait(@lock)
      end
    end
  end

  def checkin(socket)
    @lock.synchronize do
      @available_sockets << socket
      @queue.broadcast
    end
  end

end