export async function uploadResumeMock(file) {
  await new Promise((r) => setTimeout(r, 800));

  const name = file?.name?.toLowerCase() || "";
  if (name.includes("frontend")) {
    return { skills: ["HTML", "CSS", "JavaScript", "React"] };
  }
  return { skills: ["Python", "Pandas", "NumPy"] };
}
