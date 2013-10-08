An increasing number of us are becoming gem authors
  proprietary gem authors
  open source gem authors

I went through this transition when a Rails developer.
  We broke up our Rails app into two separate apps and put all business logic in a gem.
  Found myself thinking about API more than I ever have.
  Now I'm at MongoDB, where all I think about is users and how they will use the mongo/bson gems.

This is a transition from
  Writing code that served users with a browser and a mouse to serving other developers.
  These other developers are
    - present colleagues
    - future colleagues
    - your future self
    - other developers (for open source gem authors)

You can't just write code that "works", there are other considerations
  Your code will not speak for itself
  example: quote from someone who comments on the design of a gem. Still appreciates it.

API design is UX design.
Why is this important?

UX Fund (2006 - 2007)
  The UX Fund was an experiment to prove that UX design has impact on user satisfaction.
  50,000 dollars were invested in 10 companies said to have exemplary UX experiences.
  After one year, it was found that their stock prices went up significantly.

If your code has a positive user experience, your numbers will go up too.
  ex: rubygems

This is extremely important at MongoDB.
We call our drivers, docs, tools team, the "DX team"

So how is gem API design UX design?

You have users. You need to know your users.
  I'm spying on rubyists all the time.
  - I go to conferences in part to spy on rubyists. I want to know:
      - What you are interested in
      - How you're using Ruby
      - What you're complaining about
      - What projects rubyists are working on
  - I read twitter and blogs to spy on you
  - I give presentations and talk about the mongo gem to get feedback
  If you know your users, you can establish trust with them.
    - One way to maintain trust is to use semantic versioning.
    - Identify some star users who you can trust.

Once you know your users, apply UX design concepts.
I'm going to focus on 3
  Mapping
    Mapping to users' expectations. System state should be visible, and the effects of knobs should be obvious.
  Consistency
    Similar elements should be used for achieving similar tasks.
  Simplicity
    Reveal only what's necessary. Focus on what is important.

by showing
  5 Mapping Mantras
  4 Consistency Commandments
  3 Simplicity Suggestions

5 Mapping Mantras
  1. Don't monkey-patch core Ruby classes. When a user calls a particular method or uses a particular class, their expectations should be met.
    - Example: monkey-patching the lock method
  2. The result of a user doing a certain operation should be obvious and there should be no side effects. It's scary to think that calling a certain method could have an effect you won't see.
  3. Documentation should never be overlooked.
    Good documentation is part of what helped MongoDB get wide adoption.
    - inline documentation
    - readmes
    - tools, like yard docs
    - Example: Mongoid's documentation
  4. Users should have to chain method after method. Not only is it messy, it makes their code look worse.
  5. Informaton error messages
    They should tell you info about system state. If expectations aren't met, tell them.

4 Simplicity Suggestions
  1. Classes should have a single responsibility.
    - One class should have a clear responsibility, and stick to only carrying out that responsibility. This should be obvious to users through the name of the class and the methods/attributes available.
    - Make careful choices about what methods are public and private.
    - Choose which attributes are available, using attr_reader, attr_writer, attr_accessor
  2. Hide implementation details.
    - Use arbitrary opts and deal with them yourself in the method.
    - Reduce lines of repeated code using block.
  3. Provide helpers only when necessary
    - More code means more things you have to maintain
  4. Avoid meta-programming

3 Consistency commandments
  1. Variable, method, namespace names should be consistent.
    - Stick to ? for boolean method
    - Use ! for methods that require more attention (that are special).
    - variable names should be obvious
    - module names should be of the same verb style
  2. Consistent style is important for current and future devs, and readers of your code.
    - Use something like rubocup to 
      - set line length
      - use consistent spacing
      - use symbols instead of strings
      - method length
      - class length
  3. Calling methods with similar or the same names in two different classes should do the same thing.
    - exceptions should be raised consistently. For example, if you check the keys of a document in one scenario, it should be checked in another scenario.
    - Example: rerouting to the primary.











