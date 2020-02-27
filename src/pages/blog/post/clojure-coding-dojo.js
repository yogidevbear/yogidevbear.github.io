import React from 'react'
import { Link } from 'components/Router'
import { PostHeader } from 'components/PostHeader'
import Highlight from 'react-highlight'

export default () => (
  <div>
    <PostHeader headerImageUrl="simon-matzinger-twukN12EN7c-unsplash.jpg"
                title="Clojure Coding Dojo"
                attributionName="Simon Matzinger"
                attributionUrl="https://unsplash.com/@8moments?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" />

    <h2>Setting the backdrop</h2>

    <p>I've been using Clojure for a little over three years and I finally made it to my first Clojure coding dojo at the London ThoughtWorks office a few weeks ago. I've wanted to attend one of these events for a while, but living outside of London has prevented me from doing so until now.</p>
    
    <p>I enjoyed the evening. If you haven't attended one of these events yet either, I would highly recommend trying to go to one. You can find out more about the <a href="https://www.meetup.com/London-Clojurians/">London Clojurians meetup group</a> here.</p>
    
    <hr />
    
    <p><em>I'd also like to make special mention of <a href="https://clojurebridge.org/">ClojureBridge</a> which "aims to increase diversity within the Clojure community by offering free, beginner-friendly Clojure programming workshops for underrepresented groups in tech." If you're in the London area and want to get involved, either as a student or as a coach, please checkout <a href="https://clojurebridgelondon.github.io/">ClojureBridge London</a>.</em></p>
    
    <hr />

    <h2>Dojo structure</h2>

    <p>There is a lot of literature on the internet about running your own coding dojo so I won't go into detail here. The basic idea is to suggest a few problems to work on, vote on those to narrow the final selection, and then to split into smaller groups and work on a problem together. The final 30 minutes can be used for the groups to share what they may have learned during the session.</p>

    <h2>The challenge</h2>

    <p>I was in a group of three and we chose to work on solving the <a href="https://www.codewars.com/kata/snail">Codewars snail kata</a>. When given an <pre>n x n</pre> array, your code has to return the array elements arranged from outermost elements to the centre element, traveling in a clockwise direction.</p>

    <h2>The code</h2>

    <p>The code that follows is what I implemented at home in the days after the dojo. It was based on my memories of what we attempted on the night. There may be some subtle differences, but the essence should be the same. You can checkout the code for this post at <a href="https://github.com/yogidevbear/clojure-playground/tree/master/snailsort">https://github.com/yogidevbear/clojure-playground/tree/master/snailsort</a>.</p>

    <p>We start by creating a new Clojure project using <a href="https://leiningen.org/">Leiningen</a>. From the terminal, run:</p>

    <div class="file-name">Terminal:</div>
    <Highlight className='plaintext'>
    lein new snailsort
    </Highlight>

    <p>This creates a new project folder called <pre>snailsort</pre> with the following directory structure:</p>

    <div class="file-name">Directory structure:</div>
    <Highlight className='plaintext'>
      {"snailsort/"}<br/>
      {"  src/"}<br/>
      {"    snailsort/"}<br/>
      {"      core.clj"}<br/>
      {"  test/"}<br/>
      {"    snailsort/"}<br/>
      {"      core_test.clj"}<br/>
      {"  project.clj"}
    </Highlight>

    <p>Next, we change into the snailsort directory and start the tests using <pre>lein test-refresh</pre>.</p>

    <Highlight className="text">
      cd snailsort<br/>
      lein test-refresh
    </Highlight>

    <p>This should start running the code tests in the terminal. Every time we save any file in the <pre>test</pre> or <pre>src</pre> folders, the tests will be re-run automatically for us.</p>

    <p>We want to adhere to TDD. Using your editor of choice, open <pre>test/snailsort/core_test.clj</pre>. The <pre>snailsort.core-test</pre> namespace requires the <pre>snailsort.core</pre> namespace found in <pre>src/snailsort/core.clj</pre>. Update the <pre>require</pre> on lines 2-3 to alias <pre>snailsort.core</pre> as <pre>snail</pre>.</p>

    <div class="file-name">test/snailsort/core_test.clj:</div>
    <Highlight className="Clojure">
      {"(ns snailsort.core-test"}<br />
      {"  (:require [clojure.test :refer :all]"}<br />
      {"            [snailsort.core :as snail]))"}
    </Highlight>

    <p>This allows us to call functions within <pre>snailsort.core</pre> using syntax like <pre>(snail/some-function-name args)</pre>.</p>

    <p>We decided on the evening that we would make use of array coordinates to reference positions within the array we were trying to sort. Let's define a 3x3 grid that we want to sort (as well as adding a commented out matrix to help us conceptualise the relative x+y coordinates while we work on the solution).</p>

    <div class="file-name">test/snailsort/core_test.clj:</div>
    <Highlight className="Clojure">
      {"; Reference coordinates"}<br/>
      {";   x y"}<br/>
      {"; [[0 0] [0 1] [0 2]"}<br/>
      {";  [1 0] [1 1] [1 2]"}<br/>
      {";  [2 0] [2 1] [2 2]]"}<br/>
      {""}<br/>
      {"(def grid"}<br/>
      {"  [[1 2 3]"}<br/>
      {"   [8 9 4]"}<br/>
      {"   [7 6 5]])"}
    </Highlight>

    <p>The initial path we took was to figure out how to traverse the grid. The first solution is sub-optimal, but I will run through it here first and then show a different approach towards the end which should illustrate what I mean.</p>

    <p>We have our grid above and we want to know how to find the next appropriate adjacent coordinate in our spiral sequence. We will define a <pre>next-coordinate</pre> function which will take a direction keyword and a current coordinate position. If we look at our commented reference grid above, we can see that our first coordinate on the top left is <pre>[0 0]</pre> and the next position to the <pre>:right</pre> will be <pre>[0 1]</pre>. Using this logic we can start off by writing our first test with a few different assertions.</p>

    <div class="file-name">test/snailsort/core_test.clj:</div>
    <Highlight className="Clojure">
      {"(deftest next-coordinate"}<br/>
      {"  (testing \"Test retrieving next coordinate\""}<br/>
      {"    (is (= [0 1] (snail/next-coordinate :right [0 0])))"}<br/>
      {"    (is (= [2 1] (snail/next-coordinate :left [2 2])))"}<br/>
      {"    (is (= [2 2] (snail/next-coordinate :down [1 2])))"}<br/>
      {"    (is (= [1 0] (snail/next-coordinate :up [2 0])))))"}
    </Highlight>

    <p>Now we can add some code to our core namespace.</p>

    <div class="file-name">src/snailsort/core.clj:</div>
    <Highlight className="Clojure">
      {"(def directions"}<br/>
      {"  {:right #(update-in % [1] inc)"}<br/>
      {"   :down #(update-in % [0] inc)"}<br/>
      {"   :left #(update-in % [1] dec)"}<br/>
      {"   :up #(update-in % [0] dec)})"}<br/>
      {""}<br/>
      {"(defn next-coordinate"}<br/>
      {"  \"I return the next grid coordinate based on current position and direction\""}<br/>
      {"  [direction current]"}<br/>
      {"  ((directions direction) current))"}
    </Highlight>

    <p>When you save these changes, you should see the tests refresh in your terminal, with an output similar to:</p>

    <div class="file-name">Terminal:</div>
    <Highlight className='plaintext'>
      {"*********************************************"}<br />
      {"*************** Running tests ***************"}<br />
      {":reloading (snailsort.core snailsort.core-test)"}<br />
      {""}<br />
      {"Testing snailsort.core-test"}<br />
      {""}<br />
      {"Ran 1 tests containing 4 assertions."}<br />
      {"0 failures, 0 errors."}<br />
      {""}<br />
      {"Passed all tests"}
    </Highlight>

    <p>I won't mention the test output again. The main point I'm hoping to illustrate is the quick feedback loop that you get from following this approach. Now back to the actual code above.</p>

    <p>The first thing we did, was define a Clojure map call <pre>directions</pre>. This will map each of the four direction keywords to a relative function for updating the <pre>[x y]</pre> coordinates that we're trying to keep track of as we step through solving the grid path.</p>

    <p>In the example of calling <pre>(next-coordinate :right [0 0])</pre>, this will resolve to <pre>((directions :right) [0 0])</pre> which will ultimately resolve to <pre>(#(update-in % [1] inc) [0 0])</pre>, which will return <pre>[0 1]</pre>.</p>

    <p>I'm sure by now, you're already noting that we need to check that the coordinate we're returning is _actually_ valid. We don't want to get into a situation where we're going outside the possible confines of our grid.</p>

    <p>Let's go back and write our next test to check if an <pre>[x y]</pre> coordinate is valid.</p>

    <div class="file-name">test/snailsort/core_test.clj:</div>
    <Highlight className="Clojure">
      {"(deftest is-valid?"}<br />
      {"  (testing \"Test if next coordinate is valid\""}<br />
      {"    (is (= true (snail/is-valid? grid [0 2])))"}<br />
      {"    (is (= true (snail/is-valid? grid [1 1])))"}<br />
      {"    (is (= false (snail/is-valid? grid [0 3])))"}<br />
      {"    (is (= false (snail/is-valid? grid [0 3])))))"}
    </Highlight>

    <p>We are testing two positions that we know will be valid and two which won't be. Next we can switch to our core namespace and write the function to pass the test.</p>

    <div class="file-name">src/snailsort/core.clj:</div>
    <Highlight className="Clojure">
      {"(defn is-valid?"}<br />
      {"  \"I return a boolean if a coordinate is valid or not\""}<br />
      {"  [grid coordinate]"}<br />
      {"  (some? (get-in grid coordinate)))"}
    </Highlight>

    <p>This function is pretty straightforward. We're just checking if we can return a value from our grid by using <pre>get-in</pre> with our <pre>[x y]</pre> coordinate.</p>

    <p>We have a way to get an adjacent position and a way to test for valid positions. Next, we need a way to determine our next clockwise direction for when we need to switch things up. Here is the test:</p>

    <div class="file-name">test/snailsort/core_test.clj:</div>
    <Highlight className="Clojure">
      {"(deftest next-direction"}<br />
      {"  (testing \"Test next-direction for clockwise rotation\""}<br />
      {"    (is (= :down (snail/next-direction :right)))"}<br />
      {"    (is (= :left (snail/next-direction :down)))"}<br />
      {"    (is (= :up (snail/next-direction :left)))"}<br />
      {"    (is (= :right (snail/next-direction :up)))))"}
    </Highlight>

    <p>And the code to solve it (note that we need a map to help with the clockwise step):</p>

    <div class="file-name">src/snailsort/core.clj:</div>
    <Highlight className="Clojure">
      {"(def clockwise-direction"}<br />
      {"  {:right :down"}<br />
      {"   :down :left"}<br />
      {"   :left :up"}<br />
      {"   :up :right})"}<br />
      {""}<br />
      {"(defn next-direction"}<br />
      {"  \"I return the next clockwise direction\""}<br />
      {"  [direction]"}<br />
      {"  (direction clockwise-direction))"}
    </Highlight>

    <p>Our next logical step is to check that we haven't visited a position before. We can write a function that takes a set of previously visited positions and the coordinate we want to test and return <pre>true</pre> if it isn't found in the set.</p>

    <div class="file-name">test/snailsort/core_test.clj:</div>
    <Highlight className="Clojure">
      {"(deftest first-visit?"}<br />
      {"  (testing \"Test if coordinate is being visited for the first time\""}<br />
      {"    (is (= true (snail/first-visit? #{} [0 0])))"}<br />
      {"    (is (= false (snail/first-visit? #{[0 0]} [0 0])))"}<br />
      {"    (is (= true (snail/first-visit? #{[0 0] [0 1]} [0 2])))"}<br />
      {"    (is (= false (snail/first-visit? #{[0 0] [0 1] [0 2]} [0 2])))))"}
    </Highlight>

    <div class="file-name">src/snailsort/core.clj:</div>
    <Highlight className="Clojure">
      {"(defn first-visit?"}<br />
      {"  \"I check if a grid cell is being checked for the first time\""}<br /> 
      {"  [checked current]"}<br />
      {"  (nil? ((set checked) current)))"}
    </Highlight>

    <p>We also want to know if we've completed traversing the grid.</p>

    <div class="file-name">test/snailsort/core_test.clj:</div>
    <Highlight className="Clojure">
      {"(deftest all-visits?"}<br />
      {"  (testing \"Test if visited set size matches grid size\""}<br />
      {"    (is (= false (snail/all-visits? grid #{[0 0]})))"}<br />
      {"    (is (= false (snail/all-visits? grid #{[0 0] [0 1]})))"}<br />
      {"    (is (= true (snail/all-visits? grid #{[0 0] [0 1] [0 2] [1 0] [1 1] [1 2] [2 0] [2 1] [2 2]})))"}<br />
      {"    (is (= true (snail/all-visits? grid #{[0 0] [0 1] [0 2] [1 2] [2 2] [2 1] [2 0] [1 0] [1 1]})))))"}
    </Highlight>

    <div class="file-name">src/snailsort/core.clj:</div>
    <Highlight className="Clojure">
      {"(defn all-visits?"}<br />
      {"  \"I check if all grid cells have been checked\""}<br />
      {"  [grid checked]"}<br />
      {"  (= (count (flatten grid))"}<br />
      {"     (count checked)))"}
    </Highlight>

    <p>The above few functions give us most of the pieces we need for validation purposes. Let's switch things up and start working towards solving the path we want to traverse.</p>

    <hr />

    <p>NOTE:<br/>
    <em>It was at this point where I was working at home on the remainder of the solution by myself. At the time, I was wondering whether there was a more idiomatic solution that could be used instead. Although the code we have so far is well tested and makes a lot of sense, it is also growing a little unwieldy. For the purposes of this article though, I'll continue with the current solution and come back to a more succinct solution at the end.</em></p>

    <hr />

    <p>The next logical step in the current approach is to figure out which is the next valid position to traverse. We need to know if we can keep going in the current direction or whether we need to turn clockwise, etc. There are a few test assertions we can use here to cover all our bases.</p>

    <div class="file-name">test/snailsort/core_test.clj:</div>
    <Highlight className="Clojure">
      {"(deftest next-valid-coordinate"}<br />
      {"  (testing \"Test next valid position in grid\""}<br />
      {"    (is (= {:direction :right :next-coordinate [0 1]} (snail/next-valid-coordinate grid [0 0] :right #{[0 0]})))"}<br />
      {"    (is (= {:direction :left :next-coordinate [2 1]} (snail/next-valid-coordinate grid [2 2] :down #{[0 0] [0 1] [0 2] [1 2] [2 2]})))"}<br />
      {"    (is (= {:direction :up :next-coordinate [1 0]} (snail/next-valid-coordinate grid [2 0] :left #{[0 0] [0 1] [0 2] [1 2] [2 2] [2 1] [2 0]})))"}<br />
      {"    (is (= {:direction :right :next-coordinate [1 1]} (snail/next-valid-coordinate grid [1 0] :up #{[0 0] [0 1] [0 2] [1 2] [2 2] [2 1] [2 0] [1 0]})))"}<br />
      {"    (is (= nil (snail/next-valid-coordinate grid [1 1] :down #{[0 0] [0 1] [0 2] [1 2] [2 2] [2 1] [2 0] [1 0] [1 1]})))))"}
    </Highlight>

    <div class="file-name">src/snailsort/core.clj:</div>
    <Highlight className="Clojure">
      {"(defn next-valid-coordinate"}<br />
      {"  \"I return the next valid coordinate or nil if none exists\""}<br />
      {"  [grid current direction checked]"}<br />
      {"  (let [next-pos (next-coordinate direction current)"}<br />
      {"        new-direction (next-direction direction)"}<br />
      {"        rotated-pos (next-coordinate new-direction current)]"}<br />
      {"    (if (and (is-valid? grid next-pos)"}<br />
      {"             (first-visit? checked next-pos))"}<br />
      {"      {:direction direction :next-coordinate next-pos}"}<br />
      {"      (if (and (is-valid? grid rotated-pos)"}<br />
      {"               (first-visit? checked rotated-pos))"}<br />
      {"        {:direction new-direction :next-coordinate rotated-pos}"}<br />
      {"        nil))))"}
    </Highlight>

    <p>The idea of <pre>next-valid-coordinate</pre> is to return a map of the next position, _as well as_ the direction for the next test. We need to return the direction in the result as we need to be made aware of any potential change in direction.</p>

    <p>One thing we haven't covered yet, and is a requirement for the kata, is to validate that the grid being supplied is actually a valid square.</p>

    <p>We want to test a variety of valid grid sizes, so lets start with a function in our test file to generate grids of any specified length.</p>

    <div class="file-name">test/snailsort/ore_test.clj:</div>
    <Highlight className="Clojure">
      {"(defn generate-grid"}<br />
      {"  \"Generates a random n x n grid\""}<br />
      {"  [n]"}<br />
      {"  (if (< n 1)"}<br />
      {"    [[]]"}<br />
      {"    (let [row (fn [] (take n (repeatedly #(rand-int 10))))]"}<br />
      {"      (into [] (take n (repeatedly #(into [] (row))))))))"}
    </Highlight>

    <p>Now we can define our test and function to check if a grid is a valid square.</p>

    <div class="file-name">test/snailsort/ore_test.clj:</div>
    <Highlight className="Clojure">
      {"(deftest is-valid-grid?"}<br />
      {"  (testing \"Test if grid supplied is valid n x n square\""}<br />
      {"    (is (= false (snail/is-valid-grid? [])))"}<br />
      {"    (is (= false (snail/is-valid-grid? [1 2 3])))"}<br />
      {"    (is (= false (snail/is-valid-grid? [[1 2 3] [4 5 6]])))"}<br />
      {"    (is (= false (snail/is-valid-grid? [[1 2 3] [4 5] [6 7 8 9]])))"}<br />
      {"    (is (= true (snail/is-valid-grid? grid)))"}<br />
      {"    (is (= true (snail/is-valid-grid? (generate-grid 0))))"}<br />
      {"    (is (= true (snail/is-valid-grid? (generate-grid 3))))"}<br />
      {"    (is (= true (snail/is-valid-grid? (generate-grid 9))))"}<br />
      {"    (is (= true (snail/is-valid-grid? (generate-grid 100))))"}<br />
      {"    (is (= true (snail/is-valid-grid? (generate-grid 1000))))))"}
    </Highlight>

    <div class="file-name">src/snailsort/core.clj:</div>
    <Highlight className="Clojure">
      {"(defn is-valid-grid?"}<br />
      {"  \"I check if a supplied grid is a valid n x n grid\""}<br />
      {"  [grid]"}<br />
      {"  (if (= grid [[]])"}<br />
      {"    true"}<br />
      {"    (let [height (count grid)]"}<br />
      {"      (if (> height 0)"}<br />
      {"        (every? #{true}"}<br />
      {"                (map #(and (= (type %) (type []))"}<br />
      {"                           (= height (count %)))"}<br />
      {"                     grid))"}<br />
      {"        false))))"}
    </Highlight>

    <p>We have most of the parts we need for a final solution. The approach that I initially went for was to work out the sequence as a list of cooridates and then use that sequence to fetch the individual position values. First we need the function to work out the sequence. For this, we can also add a couple of other variations of grids to test, followed by the sequence function test.</p>

    <div class="file-name">test/snailsort/ore_test.clj:</div>
    <Highlight className="Clojure">
      {"(def grid-alt-1"}<br />
      {"  [[1 2]"}<br />
      {"   [4 3]])"}<br />
      {""}<br />
      {"(def grid-alt-2"}<br />
      {"  [[1 2 3 4 5]"}<br />
      {"   [16 17 18 19 6]"}<br />
      {"   [15 24 25 20 7]"}<br />
      {"   [14 23 22 21 8]"}<br />
      {"   [13 12 11 10 9]])"}<br />
      {""}<br />
      {"(deftest sequence-path"}<br />
      {"  (testing \"Test if sequence-path returns the correct vector sequence of coordinate points of snailsort\""}<br />
      {"    (is (= [[0 0] [0 1] [0 2] [1 2] [2 2] [2 1] [2 0] [1 0] [1 1]] (snail/sequence-path grid)))"}<br />
      {"    (is (= [[0 0] [0 1] [1 1] [1 0]] (snail/sequence-path grid-alt-1)))"}<br />
      {"    (is (= [[0 0] [0 1] [0 2] [0 3] [0 4] [1 4] [2 4] [3 4] [4 4] [4 3] [4 2] [4 1] [4 0] [3 0] [2 0] [1 0] [1 1] [1 2] [1 3] [2 3] [3 3] [3 2] [3 1] [2 1] [2 2]] (snail/sequence-path grid-alt-2)))))"}
    </Highlight>

    <div class="file-name">src/snailsort/core.clj:</div>
    <Highlight className="Clojure">
      {"(defn sequence-path"}<br />
      {"  \"I return a vector of the spiral path\""}<br />
      {"  ([grid]"}<br />
      {"   (sequence-path grid [] [0 0] :right))"}<br />
      {"  ([grid res current direction]"}<br />
      {"   (let [res (conj res current)]"}<br />
      {"     (if (< (count res) (count (flatten grid)))"}<br />
      {"       (let [next-valid (next-valid-coordinate grid current direction res)]"}<br />
      {"         (recur grid res (:next-coordinate next-valid) (:direction next-valid)))"}<br />
      {"       res))))"}
    </Highlight>

    <p>I've used a 2-arity function definition here so that we can simply pass in the grid and let the known defaults initialise the main recursive functionality. With each iteration, we conjoin the current position to the result. We then check if the result has the same number of coordinates as positions in the main grid. If it is smaller, we recall (<pre>recur</pre>) the function with the result and the next coorditate. If the result is the same size as the grid, then we can return the result.</p>

    <p>We have everything we need now, so let's implement the main snailsort function.</p>

    <div class="file-name">test/snailsort/ore_test.clj:</div>
    <Highlight className="Clojure">
      {"(deftest snailsort"}<br />
      {"  (testing \"Test snailsort function\""}<br />
      {"    (is (= [] (snail/snailsort [[]])))"}<br />
      {"    (is (= (mapv inc (range 9)) (snail/snailsort grid)))"}<br />
      {"    (is (= (mapv inc (range 4)) (snail/snailsort grid-alt-1)))"}<br />
      {"    (is (= (mapv inc (range 25)) (snail/snailsort grid-alt-2)))"}<br />
      {"    (is (= [1 2 3 6 9 8 7 4 5] (snail/snailsort [[1 2 3] [4 5 6] [7 8 9]])))))"}
    </Highlight>

    <div class="file-name">src/snailsort/core.clj:</div>
    <Highlight className="Clojure">
      {"(defn snailsort"}<br />
      {"  \"I sort an n x n grid in a clockwise spiral pattern\""}<br />
      {"  [grid]"}<br />
      {"  (if (is-valid-grid? grid)"}<br />
      {"    (if (= grid [[]])"}<br />
      {"      []"}<br />
      {"      (let [spiral-path (sequence-path grid)]"}<br />
      {"        (mapv #(get-in grid %) spiral-path)))"}<br />
      {"    nil))"}
    </Highlight>

    <p>And there you have it. A <pre>snailsort</pre> function that we can call with a grid which will return the expected result for a valid grid or <pre>nil</pre> for a bogus grid.</p>

    <h2>Improving the solution</h2>

    <p>As you can see, the solution works, but is rather lengthly. I was chatting to a friend who's work colleague, Corneliu Hoffmann, created a solution using the concept of rotating the grid as opposed to trying to walk the grid sequentially. I spent a bit of time thinking about this and decided to try my own implementation using this concept.</p>

    <h3>Understanding the rotation</h3>

    <p>Assume we have the following grid:</p>

    <Highlight className="Clojure">
      {"[[1 2 3]"}<br />
      {" [4 5 6]"}<br />
      {" [7 8 9]]"}
    </Highlight>

    <p>I want to be able to have a result of <pre>[1 2 3 6 9 8 7 4 5]</pre> for my sorted result. I can take the first row (i.e. <pre>[1 2 3]</pre>) in order to start my result. This will leave me with the rest.</p>

    <Highlight className="Clojure">
      {"[[4 5 6]"}<br />
      {" [7 8 9]]"}
    </Highlight>

    <p>Now for the rotation, we want to convert the above into a new structure, namely:</p>

    <Highlight className="Clojure">
      {"[[6 9]"}<br />
      {" [5 8]"}<br />
      {" [4 7]]"}
    </Highlight>

    <p>Then I can take the first row from that (i.e. <pre>[6 9]</pre>) and join it to my current result (i.e. <pre>[1 2 3 6 9]</pre>) which will leave me with the rest.</p>

    <Highlight className="Clojure">
      {"[[5 8]"}<br />
      {" [4 7]]"}
    </Highlight>

    <p>And then we repeat the process until there is nothing left. At that point, we can return our result.</p>

    <h3>What does it look like?</h3>

    <p>Here is my attempt at this solution.</p>

    <div class="file-name">src/snailsort/core.clj:</div>
    <Highlight className="Clojure">
      {"(defn rotation-sort"}<br />
      {"  \"An alternative solution to snailsort.\""}<br />
      {"  [grid]"}<br />
      {"  (when (is-valid-grid? grid)"}<br />
      {"    (loop [acc []"}<br />
      {"           coll grid]"}<br />
      {"      (if (empty? coll)"}<br />
      {"        (flatten acc)"}<br />
      {"        (recur (conj acc (first coll))"}<br />
      {"               (partition (count (rest coll))"}<br />
      {"                          (apply interleave"}<br />
      {"                                 (map reverse (rest coll)))))))))"}
    </Highlight>

    <p>I think this solution is really interesting. We can get rid of most of the functions we wrote previously. The only two functions we need are the one above, and <pre>is-valid-grid?</pre> because we still want to validate our input before attempting to sort it. This example shows how a change in perspective can have a significant impact on the approach we end up taking.</p>

    <h2>Conclusion</h2>

    <p>I hope you enjoyed reading this post. Hopefully you learned something new along the way. I learned a few things by attending the Clojure coding dojo and working through this solution at home afterwards. I would like to encourage anyone reading this to attend a coding dojo in whichever programming language(s) you're interested in. It's a great way to meet like-minded people and learn new things. I'll definitely be attending more of them myself in the near future.</p>
  </div>
)