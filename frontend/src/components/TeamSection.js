import React from 'react';
import teamMembers from './TeamData';
import './TeamSection.css';

const TeamSection = () => {
  return (
    <div className="team-section" id="team">
      <h2>Meet Our Team</h2>
      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.image} alt={member.name} className="team-photo" />
            <h3>{member.name}</h3>
            <p>{member.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
