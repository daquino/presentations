db = db.getSiblingDB("aggregation_examples");
db.books.drop();


db.books.save( {
	
	_id : 1, 
	title : "The Great Gatsby",
	author : { first_name : "F. Scott", last_name : "Fitzgerald" },
	ISBN : "9781857150193",
	available: true,
	publisher : {
		publisher_name : "Everyman's Library",
		place : "London",
		date : ISODate("1991-09-19T00:00:00Z"),
		},
	pages : 176,
	subjects : ["Long Island", "American Literature", "Love stories", "1920s", "Jazz Age"],
	reviews : [
		{ user : "Emily", note : "It's hard to decide whether you like or hate the characters, they are all so complex.", rating : 5},
		{ user : "Mike", note : "One of the best moden American novels", rating : 3 }
	],
	language : "English",
	introduction : 20	
	}
);

db.books.save( {
	
	_id : 2, 
	title : "This Side of Paradise",
	author : { first_name : "F. Scott", last_name : "Fitzgerald" },
	ISBN : "014018077X",
	available: true,
	publisher : {
		publisher_name : "Penguin Books",
		place : "New York",
		date : ISODate("1996-09-19T00:00:00Z"),
		},
	pages : 268,
	subjects : ["American Literature", "Bildungsromane", "Classic"],
	reviews : [
		{ user : "Bob", note : "I have to say that I found this book quite boring.", rating : 1},
		{ user : "Don", note : "Anyone who liked the Great Gatsby will like this book.", rating : 4 }
	],
	language : "English"	
	}
);

db.books.save( {
	
	_id : 3, 
	title : "The Gift",
	author : { first_name : "Vladimir", last_name : "Nabokov" },
	ISBN : "978-0061148514",
	available: false,
	publisher : {
		publisher_name : "Harper Perennial Modern Classics",
		place : "New York",
		date : ISODate("2006-10-17T00:00:00Z"),
		},
	pages : 288,
	subjects : ["Depression", "Feminism", "Classic"],
	reviews : [
		{ user : "Emily", note : "This is a book worth reading slowly, I like the pace of the text.", rating : 4 }
	],
	language : "Russian",
	introduction : 10	
	}
);


// Simple project 
var ex1 = db.books.aggregate(
	{ $project : { title : 1, author : 1}	
	}	
);


// Exclude the id field from the projection
var ex2 = db.books.aggregate(
	{ $project : { _id : 0, title : 1, author : 1}	
	}	
);


// Use db/runCommand instead of wrapper
var ex3 = db.runCommand(
	{ aggregate : "books", pipeline : [
    	{ 
			$project : { _id : 0, title : 1, author : 1}
	}
	]}
);


// Unwind operator
var ex4 = db.books.aggregate(
	{ $unwind : "$subjects" }	
);


// Project combined with unwind operator
var ex5 = db.books.aggregate(
	{ $project : 
				{title : 1, author : 1, subjects : 1 } 
	},
	{ $unwind : "$subjects"	}	
);


// Bring nested values to top level using project
var ex6 = db.books.aggregate(
	{ $project : 
			{title : 1, 
			 author_first : "$author.first_name", 
			 author_last : "$author.last_name" } 
	}	
);


// Using project to create a new field with computed values
// eq is a two-operand expression.  $add can have any number of operands.
var ex7 = db.books.aggregate(
	{ $project : 
		{ _id : 0,
		  title : 1, 
		  author : 1, 
		  nabokov_wrote_it :  { $eq:["$author.last_name", "Nabokov"] } }
	}	
);


// Use project to push top-level fields into subdocuments
var ex8 = db.books.aggregate(
	{ $project : 
		{ _id : 0,
		  title : 1, 
		  author : 1, 
		  subjects :  1 }
	},
	{ $unwind : "$subjects" },
	{ $project : 
		{ subjects : 1,
		  text : { 
				author : "$author", 
				title : "$title" 
				}
		}
	}
);


// Nested computed expressions.
// $ifNull returns the first value if it's not null, otherwise, returns second value
var ex9 = db.books.aggregate(
	{ $project : { 
		_id : 0,
		title : 1, 
		author : 1,
		totalPages : {
			$add : ["$pages" , { $ifNull : [ "$introduction", 0 ] }]
			}
		}	
	}	
);


// Project fields from nested documents
var ex10 = db.books.aggregate(
	{ $project : { 
		_id : 0,
		title : 1, 
		"author.last_name" : 1	
		}
	}	
);


// Sort by author last name
var ex11 = db.books.aggregate(
	{ $sort : { "author.last_name" : 1 } }
);


// Extract date
var ex12 = db.books.aggregate(
	{ $project : { 
		author : "$author.last_name", 
		title : 1,
		published_year : { $year : "$publisher.date" },
		published_month : { $month : "$publisher.date" }
		}
	}	
);


// Ternary conditional operator
var ex13 = db.books.aggregate(
	{ $project : { 
		author : "$author.last_name",
		available : 1,
        pageViews : { $cond : [ "$available",
                                "In stock", "Not available" ]
        			}
		}
	}	
);


// Simple match.  Note that this could be better done with simple find ({subjects: "Classic"})
var ex14 = db.books.aggregate(
 	{ $project : { 
		author : "$author.last_name",
		title : 1,
        subjects : 1
		},
	},
	{ $unwind : "$subjects"},
	{ $match : { subjects : "Classic" } }	
);


// Group example.  Find total pages per author, max pages of one book and average rating.
var ex15 = db.books.aggregate(
	{ $project : { 
		title : 1,
		author : "$author.last_name",
        reviews : 1,
		},
	},
	{ $unwind : "$reviews"},
	{ $group : { 
		_id : "$author",
		average_rating: {$avg : "$reviews.rating"}
		}
	}	
);


// Use group to pivot on subjects.
var ex16 = db.books.aggregate(
	{ $project : { 
		title : 1,
		author : "$author.last_name",
        reviews : 1,
		subjects : 1,
		reviewers : "$reviews.user"
		},
	},
	{ $unwind : "$subjects" },
	{ $unwind : "$reviews" },
	{ $group : { 
		_id : "$subjects",
		authors : {$addToSet : "$author" }, //note that addToSet maintains uniqueness in authors
		reviewers : {$addToSet : "$reviews.user" }
		}
	}
		
);
