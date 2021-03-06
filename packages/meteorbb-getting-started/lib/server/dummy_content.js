var toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var createPost = function (slug, postedAt, username, thumbnail) {
  var post = {
    postedAt: postedAt,
    body: Assets.getText("content/" + slug + ".md"),
    title: toTitleCase(slug.replace(/_/g, ' ')),
    dummySlug: slug,
    isDummy: true,
    userId: Meteor.users.findOne({username: username})._id
  }


  submitPost(post);
}

var createComment = function (slug, username, body, parentBody) {

  var comment = {
    postId: Posts.findOne({dummySlug: slug})._id,
    userId: Meteor.users.findOne({username: username})._id,
    body: body,
    isDummy: true,
    disableNotifications: true
  }
  if (parentComment = Comments.findOne({body: parentBody}))
    comment.parentCommentId = parentComment._id;

  submitComment(comment);
}

var createDummyUsers = function () {
  Accounts.createUser({
    username: 'cobola',
    email: 'cobola@gmail.com',
    profile: {
      isDummy: true
    }
  });
  Accounts.createUser({
    username: 'Arnold',
    email: 'dummyuser2@telescopeapp.org',
    profile: {
      isDummy: true
    }
  });
  Accounts.createUser({
    username: 'Julia',
    email: 'dummyuser3@telescopeapp.org',
    profile: {
      isDummy: true
    }
  });
}

var createDummyPosts = function () {

  createPost("read_this_first", moment().toDate(), "cobola", "telescope.png");

  createPost("deploying_meteorbb", moment().subtract(10, 'minutes').toDate(), "Arnold");

  createPost("customizing_meteorbb", moment().subtract(3, 'hours').toDate(), "Julia");

  createPost("getting_help", moment().subtract(1, 'days').toDate(), "cobola", "stackoverflow.png");

  createPost("removing_getting_started_posts", moment().subtract(2, 'days').toDate(), "Julia");

  createPost("why",moment().toDate(),"cobola");

}

var createDummyComments = function () {

  createComment("read_this_first", "cobola", "太酷了 !");

  createComment("deploying_meteorbb", "Arnold", "Deploy to da choppah!");
  createComment("deploying_meteorbb", "Julia", "Do you really need to say this all the time?", "Deploy to the choppah!");

  createComment("customizing_meteorbb", "Julia", "I can't wait to make my app pretty. Get it? *Pretty*?");

  createComment("removing_getting_started_posts", "cobola", "Yippee ki-yay, motherfucker!");
  createComment("removing_getting_started_posts", "Arnold", "I don't think you're supposed to swear in here…", "Yippee ki-yay, motherfucker!");

}

deleteDummyContent = function () {
  Meteor.users.remove({'profile.isDummy': true});
  Posts.remove({isDummy: true});
  Comments.remove({isDummy: true});
}

Meteor.methods({
  addGettingStartedContent: function () {
    if (isAdmin(Meteor.user())) {
      createDummyUsers();
      createDummyPosts();
      createDummyComments();
    }
  },
  removeGettingStartedContent: function () {
    if (isAdmin(Meteor.user()))
      deleteDummyContent();
  }
})

Meteor.startup(function () {
  // insert dummy content only if createDummyContent hasn't happened and there aren't any posts in the db
  if (!Events.findOne({name: 'createDummyContent'}) && !Posts.find().count()) {
    createDummyUsers();
    createDummyPosts();
    createDummyComments();
    logEvent({name: 'createDummyContent', unique: true, important: true});
  }
});