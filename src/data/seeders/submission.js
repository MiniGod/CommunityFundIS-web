/* eslint-disable import/prefer-default-export */
import { Submission, Vote, User } from '../models';
import { log } from '../../logger';

export const up = async () => {
  log('Submission: Seeding');

  await Submission.sync();
  await Vote.sync();

  const submission = await Submission.create({
    name: 'Kristjan',
    email: 'kristjan@foo.com',
    phone: '6961234',
    date: new Date(),
    summary: 'Some summary',
    description: 'Some description',
    askAmount: 30000,
    totalCost: 100000,
  });

  const reviewers = await User.findAll({
    where: {
      isReviewer: true,
    },
  });

  const comments = [
    'Complete non-sense',
    "Best submission I've seen",
    null,
    null,
  ];
  const answers = ['accepted', 'rejected', 'accepted', 'rejected'];

  await Vote.bulkCreate(
    reviewers.slice(1, 5).map((reviewer, i) => ({
      userId: reviewer.id,
      comment: comments[i],
      result: answers[i],
      submissionId: submission.id,
    })),
  );

  log('Submission: Done seeding');
};

export const down = async () => {
  log('Submission: Flushing');

  await Submission.sync();

  await Submission.truncate();

  log('Submission: Done Flushing');
};
