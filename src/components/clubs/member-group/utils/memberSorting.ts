type Member = {
  id: string;
  user_id: string;
  role?: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
    location: string | null;
  };
};

export const sortAndGroupMembers = (members: Member[]) => {
  // Separate captains and regular members
  const captains = members.filter(member => member.role === 'captain');
  const regularMembers = members.filter(member => member.role !== 'captain');
  
  // Sort captains by username
  const sortedCaptains = [...captains].sort((a, b) => {
    const usernameA = a.profiles.username?.toLowerCase() || '';
    const usernameB = b.profiles.username?.toLowerCase() || '';
    return usernameA.localeCompare(usernameB);
  });
  
  // Randomize regular members
  const shuffledRegularMembers = [...regularMembers].sort(() => Math.random() - 0.5);
  
  // Combine the arrays: captains first, then randomized regular members
  return [...sortedCaptains, ...shuffledRegularMembers];
};