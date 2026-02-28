import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const individuals = [
  "Becky Drake|true",
  "Brian Espinosa|true",
  "Sarah Devora|true",
  "Rolando Ortega|true",
  "Donna Espinosa|true",
  "Sawyer Knox|true",
  "Daniel Castenda|true",
  "Aaron Castenda|true",
  "Jenny Ramos|true",
  "Andrew Ortega|true",
  "Veronica Rivas|true",
  "Sandra Tristan|true",
  "Christian Briseno|true",
  "Eva Briseno|true",
  "Elizabeth Arellano|true",
  "Monica Sanchez|true",
  "Makayla Byas|true",
  "Andy DeMello|true",
  "Sam DeMello|true",
  "Jimmy DeMello",
  "Kathy Cuevas",
  "Elaine Flores",
  "Strawberry Wrooley",
  "Karen Drake",
  "Katy Drake",
  "Christian Barker",
  "Brianna Arellano",
  "Lucas Stephan",
  "Patricia Espinosa",
  "Judy DeMello",
  "Harley Vonk",
  "Aaron Caban",
  "Gabriel Castenda",
  "Sebastian Bates",
  "Vladimir Flores",
  "Madia Molina",
  "Jacob Zamora",
  "Mac Brady",
  "Zory Alvarez",
  "Alba Allas",
  "Omar Briseno",
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
    id: 1,
  },
  {
    groupName: "Stadick Family",
    people: ["Emily Stadick", "Trent Stadick", "Tayler Stadick", "Brody Stadick", "Cathy Stadick", "Micheal Cuomo"],
    id: 2,
  },
  {
    groupName: "Flores Family",
    people: ["Nelly Flores", "Waldo Flores", "Stanley Flores", "Sonya Flores", "Micheal Flores "],
    id: 3,
  },
  {
    groupName: "Gonzalez Family",
    people: ["Bryan Gonzales", "Silvia Gonzales", "Ivan Gonzales"],
    id: 4,
  },
  {
    groupName: "Alfaro Family",
    people: ["Carlos Alfaro", "Carlitos Alfaro", "Vanessa Alfaro", "Mia Alfaro"],
    id: 5,
  },
  {
    groupName: "Mugabero Family",
    people: ["Yasse Mugabero", "Kevin Mugabero", "Kayden Mugabero", "Kevin Mugabero"],
    id: 6,
  },
  {
    groupName: "Alverez Family",
    people: ["Alberto Arevalo", "Tori Arevalo", "Caroline Arevalo", "Adelina Arevalo", "Ayla Arevalo"],
    id: 7,
  },
  {
    groupName: "Jimenez Family",
    people: ["Gisselle Jimenez", "Pedro Jimenez", "William Jimenez", "Adeline Jimenez"],
    id: 8,
  },
  {
    groupName: "Stadick Family 2",
    people: ["Karen Stadick", "Ty Stadick", "Anine Stadick"],
    id: 9,
  },
  {
    groupName: "",
    people: ["Andrea Saycan",	"Rick Saycan", "Nick Saycan", "Nate Saycan"],
    id: 10,
  },
];

async function createUser(user: string, id: number) {
  const [guest, booleanVal] = user.split("|");
  const canBringPlusOne = booleanVal === "true";

  const guestParts = guest.split(" ");
  const firstName = guestParts.shift() || "";
  const lastName = guestParts.join(" ") || "";
  await prisma.user.upsert({
    where: {
      id,
    },
    create: {
      firstName,
      lastName,
      canBringPlusOne,
    },
    update: {},
  });
}

async function createGroup(group: group, id: number) {
  const newGroup = await prisma.group.upsert({
    where: {
      id: group.id,
    },
    create: { name: group.groupName },
    update: {},
  });
  const groupPromises = group.people.map(async (person, idx) => {
    const parts = person.split(" ");
    const firstName = parts.shift() || "";
    const lastName = parts.join(" ") || "";
    const personId = id + idx;
    return prisma.user.upsert({
      where: {
        id: personId,
      },
      create: {
        firstName,
        lastName,
        canBringPlusOne: false,
        groupId: newGroup.id,
      },
      update: {},
    });
  });

  await Promise.all(groupPromises);
}

async function main() {
  for (let i = 0; i < individuals.length; i++) {
    const element = individuals[i];
    await createUser(element, i + 1);
  }

  let currentId = individuals.length + 1;
  for (let i = 0; i < families.length; i++) {
    const group = families[i];
    await createGroup(group, currentId);
    currentId += group.people.length;
  }
}
main()
  .then(async (res) => {
    console.log("END", res);
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
  });
