from typing import List, Dict, Any

class JobMatcher:
    @staticmethod
    def calculate_skill_match(user_skills: List[str], required_skills: List[str]) -> int:
        """
        Calculates the percentage of required skills that the user possesses.
        """
        if not required_skills:
            return 100  # If no skills required, it's a 100% match
            
        # Convert all skills to lowercase and remove extra spaces for accurate comparison
        user_skills_set = {skill.lower().strip() for skill in user_skills}
        required_skills_set = {skill.lower().strip() for skill in required_skills}
        
        # Find the intersection (skills the user has that the job requires)
        matched_skills = user_skills_set.intersection(required_skills_set)
        
        # Calculate percentage
        match_percentage = (len(matched_skills) / len(required_skills_set)) * 100
        
        return int(match_percentage)

    @staticmethod
    def get_top_matches(user_skills: List[str], jobs_database: List[Dict[str, Any]], top_n: int = 3) -> List[Dict[str, Any]]:
        """
        Takes the user's skills and a list of job dictionaries, calculates the match 
        percentage for each, and returns the top N highest matching jobs.
        """
        matched_jobs = []

        for job in jobs_database:
            job_skills = job.get("skills", [])
            match_score = JobMatcher.calculate_skill_match(user_skills, job_skills)
            
            # Create a copy of the job dict and add the match score
            matched_job = job.copy()
            matched_job["match"] = match_score
            matched_jobs.append(matched_job)
            
        # Sort jobs by highest match percentage
        matched_jobs.sort(key=lambda x: x["match"], reverse=True)
        
        # Return only the top N jobs
        return matched_jobs[:top_n]