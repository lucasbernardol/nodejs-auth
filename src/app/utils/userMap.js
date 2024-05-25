export function userMap(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    gravatar: user.gravatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
