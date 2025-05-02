import { db } from "./index";
import * as schema from "@shared/schema";

const bookData: Omit<schema.Book, 'id' | 'createdAt'>[] = [
  {
    title: "The Magic Treehouse",
    author: "Mary Pope Osborne",
    description: "Jack and Annie discover a magical treehouse filled with books that sends them on adventures throughout time and space.",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=400&q=80",
    ageRange: "8-10",
    genre: "adventure",
    rating: 45, // 4.5 stars - stored as integer (45 = 4.5)
    reviewCount: 120,
    publishedAt: new Date("1992-07-28"),
  },
  {
    title: "Percy Jackson & The Lightning Thief",
    author: "Rick Riordan",
    description: "Percy Jackson discovers he is a demigod, the son of Poseidon, and embarks on a quest to prevent a war between the Greek gods.",
    coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=400&q=80",
    ageRange: "11-13",
    genre: "fantasy",
    rating: 42, // 4.2 stars
    reviewCount: 210,
    publishedAt: new Date("2005-06-28"),
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    description: "In a dystopian future, Katniss Everdeen volunteers to take her sister's place in a televised fight to the death called the Hunger Games.",
    coverImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=400&q=80",
    ageRange: "14-16",
    genre: "scifi",
    rating: 47, // 4.7 stars
    reviewCount: 315,
    publishedAt: new Date("2008-09-14"),
  },
  {
    title: "Diary of a Wimpy Kid",
    author: "Jeff Kinney",
    description: "Greg Heffley navigates the challenges of middle school, dealing with friends, family, and growing up, all while recording his experiences in his diary.",
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=400&q=80",
    ageRange: "8-10",
    genre: "humor",
    rating: 49, // 4.9 stars
    reviewCount: 280,
    publishedAt: new Date("2007-04-01"),
  },
  {
    title: "Wonder",
    author: "R.J. Palacio",
    description: "Auggie Pullman, who was born with a facial difference, enters a mainstream school for the first time in fifth grade and has to navigate the challenges of making friends and being accepted.",
    coverImage: "https://images.unsplash.com/photo-1603289851962-5aada9a70e46?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=400&q=80",
    ageRange: "11-13",
    genre: "realistic",
    rating: 44, // 4.4 stars
    reviewCount: 185,
    publishedAt: new Date("2012-02-14"),
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description: "Harry Potter discovers he is a wizard and begins his education at Hogwarts School of Witchcraft and Wizardry, where he makes friends and faces the dark wizard who tried to kill him as a baby.",
    coverImage: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=400&q=80",
    ageRange: "11-13",
    genre: "fantasy",
    rating: 48, // 4.8 stars
    reviewCount: 430,
    publishedAt: new Date("1997-06-26"),
  },
  {
    title: "Charlotte's Web",
    author: "E.B. White",
    description: "Wilbur the pig is saved from being slaughtered by Charlotte, a clever spider who weaves messages in her web praising Wilbur.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=400&q=80",
    ageRange: "8-10",
    genre: "classic",
    rating: 46, // 4.6 stars
    reviewCount: 165,
    publishedAt: new Date("1952-10-15"),
  },
  {
    title: "The Giver",
    author: "Lois Lowry",
    description: "In a seemingly perfect community without war, pain, or choice, Jonas is selected to be the Receiver of Memory, discovering the terrible truth about his utopian society.",
    coverImage: "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=400&q=80",
    ageRange: "14-16",
    genre: "scifi",
    rating: 43, // 4.3 stars
    reviewCount: 195,
    publishedAt: new Date("1993-04-26"),
  },
  {
    title: "Bridge to Terabithia",
    author: "Katherine Paterson",
    description: "Jess Aarons and Leslie Burke create a magical kingdom called Terabithia in the woods, where they reign as king and queen and escape the difficulties of their lives.",
    coverImage: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=400&q=80",
    ageRange: "11-13",
    genre: "realistic",
    rating: 42, // 4.2 stars
    reviewCount: 150,
    publishedAt: new Date("1977-10-21"),
  },
  {
    title: "The Maze Runner",
    author: "James Dashner",
    description: "Thomas wakes up in a place called the Glade with no memory of his past life except for his name, surrounded by other boys and a giant maze that changes every night.",
    coverImage: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=400&q=80",
    ageRange: "14-16",
    genre: "scifi",
    rating: 41, // 4.1 stars
    reviewCount: 210,
    publishedAt: new Date("2009-10-06"),
  }
];

async function seed() {
  try {
    // Check if books already exist to avoid duplicate data
    const existingBooks = await db.select().from(schema.books);
    
    if (existingBooks.length === 0) {
      console.log('Seeding books...');
      
      // Insert all books
      for (const book of bookData) {
        await db.insert(schema.books).values(book);
      }
      
      console.log('Books seeded successfully!');
    } else {
      console.log('Books already seeded, skipping...');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();
