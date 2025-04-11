
import React, { useState } from 'react';
import { SearchIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchCriteria } from '@/types';

interface SearchFormProps {
  searchCriteria: SearchCriteria;
  setSearchCriteria: (criteria: SearchCriteria) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ searchCriteria, setSearchCriteria }) => {
  const [companyInput, setCompanyInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const addCompany = () => {
    if (companyInput.trim() && !searchCriteria.companies.includes(companyInput.trim())) {
      setSearchCriteria({
        ...searchCriteria,
        companies: [...searchCriteria.companies, companyInput.trim()]
      });
      setCompanyInput('');
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !searchCriteria.skills.includes(skillInput.trim())) {
      setSearchCriteria({
        ...searchCriteria,
        skills: [...searchCriteria.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeCompany = (company: string) => {
    setSearchCriteria({
      ...searchCriteria,
      companies: searchCriteria.companies.filter(c => c !== company)
    });
  };

  const removeSkill = (skill: string) => {
    setSearchCriteria({
      ...searchCriteria,
      skills: searchCriteria.skills.filter(s => s !== skill)
    });
  };

  const handleCompanyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCompany();
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Companies
            </label>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Add company (e.g., Google)"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                onKeyDown={handleCompanyKeyDown}
                className="flex-1"
              />
              <Button type="button" onClick={addCompany}>Add</Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {searchCriteria.companies.map(company => (
                <Badge key={company} variant="secondary" className="flex items-center gap-1">
                  {company}
                  <button 
                    onClick={() => removeCompany(company)}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tech Skills
            </label>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Add skill (e.g., React)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="flex-1"
              />
              <Button type="button" onClick={addSkill}>Add</Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {searchCriteria.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button 
                    onClick={() => removeSkill(skill)}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
