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


class MongoClient

  def initialize
    ...
    @nodes = Set.new
  end

  def refresh
    disconnect_old_nodes
    connect_to_nodes
    initialize_pools(@nodes)
  end

...

  def connect_to_nodes
    seed = valid_node
    seed.node_list.each do |host|
      node = Node.new(host)
      @nodes << node if node.connect
    end
  end

end


class MongoClient

  def initialize
    ...
    @nodes = Set.new
    @connect_mutex = Mutex.new
  end

  def refresh
    @connect_mutex.synchronize do
      disconnect_old_nodes
      connect_to_nodes
      initialize_pools(@nodes)
    end
  end

...

  def connect_to_nodes
    seed = valid_node
    seed.node_list.each do |host|
      node = Node.new(host)
      @nodes << node if node.connect
    end
  end

end

class Pool
...

  def checkout
    loop do
      tid = Thread.current.object_id
      @lock.synchronize do
        ... # Thread gets its prior socket
        if @sockets.size < @max_pool_size
          socket = create_connection
          return socket
        elsif @checked_out.size < @sockets.size
          socket = available[rand(available.size)]
          return socket
        end
        @queue.wait(@lock)
      end
    end
  end

  def checkin(socket)
    @lock.synchronize do
      @checked_out.delete(socket)
      @queue.signal
    end
  end

end