// prisma/seed.js
import { faker } from '@faker-js/faker';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

const programs = [
  'Bachelors in Computer Science',
  'Masters in Business',
  'PhD in Physics',
  'Undergraduate Arts',
  'Masters in Psychology',
  'Diploma in Design',
  'MBA',
];

const statuses = [
  'Approved',
  'Pending',
  'Interview Scheduled',
  'Rejected',
  'Documents Required',
];

async function main() {
  const total = 500; // change to any number you want
  const students = [];

  //check if students already exist
  const existingStudents = await prisma.student.count();
  if (existingStudents > 0) {
    console.log(
      `✅ Found ${existingStudents} existing students, skipping seeding.`,
    );
    return;
  }

  console.log(`Seeding ${total} students...`);

  for (let i = 0; i < total; i++) {
    students.push({
      name: faker.person.fullName(),
      program: faker.helpers.arrayElement(programs),
      status: faker.helpers.arrayElement(statuses),
      applicationDate: faker.date.between({
        from: '2023-01-01',
        to: '2024-12-31',
      }),
    });
  }

  await prisma.student.createMany({ data: students });
  console.log(`✅ Seeded ${students.length} students`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
