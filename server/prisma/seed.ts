import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const individuals = [
  "Strawberry Wrooley",
  "Karen Drake",
  "Becky Drake|true",
  "Katy Drake",
  "Bryan Espinosa|true",
  "Sarah Devora|true",
  "Rolando Ortega|true",
  "Christian Barker",
  "Brianna Arellano",
  "Lucas Stephan",
  "Patricia Espinosa",
  "Donna Espinosa|true",
  "Sawyer Knox|true",
  "Judy Espinosa",
  "Harley Vonk",
  "Daniel Castenda|true",
  "Aaron Caban",
  "Aaron Castenda|true",
  "Gabriel Castenda",
  "Sebastian Bates",
  "Vladimir Flores",
  "Madia Molina",
  "Jenny Rivas|true",
  "Andrew Ortega",
  "Jacob Zamora",
  "Veronica Rivas|true",
  "Mac Brady",
  "Zory Alvarez",
  "Sandra Tristan|true",
  "Alba Allas",
  "Christian Briseno|true",
  "Omar Briseno",
  "Eva Briseno|true",
  "Elizabeth Arellano|true",
  "Isabel Hartwill",
];

type group = {
  groupName: string;
  people: string[];
  id: number;
};

const families: group[] = [
  {
    groupName: "Espinosa Family",
    people: ["Chris Espinosa", "Denice Hinojos", "Ryan Hinojos", "Jacob Hinojos", "Emma Hinojos"],
    id: 0,
  },
  {
    groupName: "Stadick Family",
    people: ["Emily Stadick", "Trent Stadick", "Tayler Stadick", "Brody Stadick", "Cathy Stadick", "Micheal Cuomo"],
    id: 1,
  },
  {
    groupName: "Flores Family",
    people: ["Nelly Flores", "Waldo Flores", "Stanley Flores", "Sonya Flores", "Micheal Flores "],
    id: 2,
  },
  {
    groupName: "Gonzalez Family",
    people: ["Bryan Gonzales", "Silvia Gonzales", "Ivan Gonzales"],
    id: 3,
  },
  {
    groupName: "Alfaro Family",
    people: ["Carlos Alfaro", "Carlitos Alfaro", "Vanessa Alfaro", "Mia Alfaro"],
    id: 4,
  },
  {
    groupName: "Mugabero Family",
    people: ["Yasse Mugabero", "Kevin Mugabero", "Kayden Mugabero", "Kevin Mugabero"],
    id: 5,
  },
  {
    groupName: "Alverez Family",
    people: ["Alberto Arevalo", "Tori Arevalo", "Caroline Arevalo", "Adelina Arevalo", "Ayla Arevalo"],
    id: 6,
  },
  {
    groupName: "Jimenez Family",
    people: ["Gisselle Jimenez", "Pedro Jimenez", "William Jimenez", "Adeline Jimenez"],
    id: 7,
  },
  {
    groupName: "Stadick Family 2",
    people: ["Karen Stadick", "Ty Stadick", "Anine Stadick"],
    id: 8,
  },
];

async function createUser(user: string) {
  const [guest, booleanVal] = user.split("|");
  let canBringPlusOne = booleanVal === "true";

  const [firstName, lastName] = guest.split(" ");
  const createdUser = await prisma.user.upsert({
    where: {
      id: 1,
    },
    create: {
      firstName,
      lastName,
      canBringPlusOne,
    },
    update: {},
  });

  console.log(createdUser);
}

async function createGroup(group: group) {
  const newGroup = await prisma.group.upsert({
    where: {
      id: group.id,
    },
    create: { name: group.groupName },
    update: {},
  });

  group.people.forEach(async (person) => {
    const [firstName, lastName] = person.split(" ");
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        canBringPlusOne: false,
        groupId: newGroup.id,
      },
    });
  });
}

async function main() {
  const userPromise = individuals.map(async (ind) => createUser(ind));
  await Promise.all(userPromise);

  const famPromise = families.map(async (fam) => createGroup(fam));

  await Promise.all(userPromise);
}
main()
  .then(async (res) => {
    console.log(res);
    prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    prisma.$disconnect();
  });
