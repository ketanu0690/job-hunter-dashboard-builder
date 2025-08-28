import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js

// Main App Component
const App = () => {
    // State to hold the original university data
    const universityData = [
        { name: "University of Augsburg", model: "Centralized", model_cat: "Centralized", details: "Operates a centralized 'Akademisches Auslandsamt' (International Office). Inquiries are funneled to this single department. No general email is listed, suggesting contact via web forms or specific staff.", emails: [{label: "Incoming Mobility Officer", email: "sabine.meister@aaa.uni-augsburg.de"}] },
        { name: "LMU München", model: "Web-Centric", model_cat: "Web-Centric", details: "A leading research university that relies on a web-centric model. No direct email for international admissions is provided on the main pages; users must navigate to specific program pages.", emails: [{label: "General Phone", email: "+49 89 2180-0"}] },
        { name: "Frankfurt University of Applied Sciences", model: "Two-Tiered", model_cat: "Specialized", details: "Uses a two-tiered system. A general info email and a specific one for prospective students (Studienbüro).", emails: [{label: "Prospective Students", email: "studienbuero@fra-uas.de"}, {label: "General Info", email: "info-center@fra-uas.de"}] },
        { name: "Paderborn University", model: "Decentralized", model_cat: "Decentralized", details: "Employs a highly granular, decentralized model with specialized emails for general questions, housing, Erasmus mobility, and the Buddy Program.", emails: [{label: "General/Application", email: "martina.leifeld@zv.uni-paderborn.de"}, {label: "Housing", email: "io-housing@zv.upb.de"}, {label: "Erasmus+", email: "stefan.blecke@zv.uni-paderborn.de"}] },
        { name: "Hamburg University of Technology (TUHH)", model: "Hybrid", model_cat: "Hybrid", details: "A hybrid model offering a general International Office email alongside a specific contact for advisory services.", emails: [{label: "International Office", email: "internationaloffice@tuhh.de"}, {label: "Advisory Services (SAFARI)", email: "safari@tuhh.de"}] },
        { name: "Trier University", model: "Centralized", model_cat: "Centralized", details: "Features a centralized International Office with a clear, primary email contact. Also lists specific staff for transparency.", emails: [{label: "International Office", email: "international@uni-trier.de"}, {label: "Proofreading Service", email: "korrektur@iz-trier.de"}] },
        { name: "Freie Universität Berlin", model: "Centralized", model_cat: "Centralized", details: "Highly centralized via its Student Services Center (SSC), which handles all inquiries from students and applicants (domestic and international) through a single email.", emails: [{label: "Student Services Center", email: "info-service@fu-berlin.de"}] },
        { name: "RWTH Aachen University", model: "Web-Centric", model_cat: "Web-Centric", details: "A large university with a decentralized, web-centric model. No single email is provided; users are directed to specialized divisions like 'International Admissions' or the 'Welcome Center' via the website.", emails: [] },
        { name: "University of Stuttgart", model: "Web-Centric", model_cat: "Web-Centric", details: "Relies on online contact forms and a detailed staff directory rather than a general email. This pre-filters inquiries and manages volume.", emails: [] },
        { name: "University of Potsdam", model: "Web-Centric", model_cat: "Web-Centric", details: "Maintains an 'International Campus' section but does not provide a direct email, channeling inquiries through specific subpages or forms.", emails: [] },
        { name: "Technical University of Munich (TUM)", model: "Centralized", model_cat: "Centralized", details: "Provides a clear, all-encompassing email for general student advising and international admissions, creating a simple and efficient point of contact.", emails: [{label: "Student Advising & Admissions", email: "studium@tum.de"}] },
        { name: "University of Freiburg", model: "Centralized", model_cat: "Centralized", details: "Employs a centralized and user-friendly model with a single email for its 'Service Center Studium' to handle all student inquiries.", emails: [{label: "Service Center Studium", email: "study@uni-freiburg.de"}] },
        { name: "Karlsruhe Institute of Technology (KIT)", model: "Web-Centric", model_cat: "Web-Centric", details: "Uses a fragmented, web-centric system. Users are directed to the International Students Office (IStO) page to find contact details, rather than a general email.", emails: [{label: "IStO Phone", email: "+49 721 608-44911"}] },
        { name: "RPTU Kaiserslautern-Landau", model: "Dual Campus", model_cat: "Specialized", details: "As a merged institution, it operates two distinct Student Service Centers, one for each campus, each with its own email.", emails: [{label: "Kaiserslautern Campus SSC", email: "ssc-kl@rptu.de"}, {label: "Landau Campus SSC", email: "ssc-ld@rptu.de"}] },
        { name: "Saarland University", model: "Centralized", model_cat: "Centralized", details: "Uses a classic centralized International Office model, with a specific email for this department, alongside a 'Welcome Center' for researchers.", emails: [{label: "International Office", email: "international@io.uni-saarland.de"}] },
        { name: "Universität Würzburg", model: "Centralized", model_cat: "Centralized", details: "Utilizes a centralized 'Service Centre International Affairs' with a direct and memorable email address for all international student matters.", emails: [{label: "International Affairs", email: "sint@uni-wuerzburg.de"}] },
        { name: "Philipps-Universität Marburg", model: "Hybrid", model_cat: "Hybrid", details: "Offers a general university email for broad inquiries and a specialized email for its 'Welcome Center for Mobile Researchers'.", emails: [{label: "General Info", email: "info@uni-marburg.de"}, {label: "Welcome Center (Researchers)", email: "welcome@uni-marburg.de"}] },
        { name: "University of Regensburg", model: "Hyper-Specialized", model_cat: "Decentralized", details: "Provides a highly detailed and hyper-specialized contact system with distinct emails for exchange students, degree-seeking students, accommodation, and transcripts.", emails: [{label: "Exchange Students", email: "international.exchange-student@ur.de"}, {label: "Degree Students", email: "international.degree-student@ur.de"}, {label: "Accommodation", email: "international.accommodation@ur.de"}] },
        { name: "University of Kassel", model: "Multi-Layered", model_cat: "Hybrid", details: "A multi-layered system with a general international office email, a specific one for study inquiries, and dedicated emails for its Welcome Centre and exchange students.", emails: [{label: "International Office", email: "international-office@uni-kassel.de"}, {label: "Study Inquiries", email: "studieren@uni-kassel.de"}, {label: "Welcome Centre", email: "welcome-centre@uni-kassel.de"}] },
        { name: "Hochschule Darmstadt", model: "Role-Based", model_cat: "Decentralized", details: "The most granular model, providing a directory of individual staff members with specific roles and emails for housing, incoming exchange, and short-term programs.", emails: [{label: "Housing Support", email: "housing.international@h-da.de"}, {label: "Incoming Exchange", email: "incoming.int@h-da.de"}, {label: "Short-term Programs", email: "short-term@h-da.de"}] },
        { name: "Ruhr University Bochum", model: "Staff-Centric", model_cat: "Specialized", details: "A staff-centric model providing direct email addresses for key personnel, like the Head of the International Office, rather than general inboxes.", emails: [{label: "Head of International Office", email: "monika.sprung@ruhr-uni-bochum.de"}, {label: "Advisor for Internationalization", email: "reena.james@ruhr-uni-bochum.de"}] },
        { name: "University of Mainz", model: "Program-Specific", model_cat: "Specialized", details: "Provides different email addresses for distinct international student programs rather than a single centralized contact.", emails: [{label: "Special Courses (GIS)", email: "gis@international.uni-mainz.de"}] },
        { name: "Goethe University Frankfurt", model: "Faculty-Specific", model_cat: "Decentralized", details: "Contact information is decentralized at the faculty level. For example, the Faculty of Economics has its own International Office email.", emails: [{label: "Int. Office (Econ/Business)", email: "international@wiwi.uni-frankfurt.de"}] },
        { name: "University of Greifswald", model: "Centralized", model_cat: "Centralized", details: "Maintains a highly centralized and straightforward model with a single, clear email address for its International Office.", emails: [{label: "International Office", email: "international.office@uni-greifswald.de"}] },
        { name: "Ulm University", model: "Tiered", model_cat: "Hybrid", details: "A tiered strategy with a general student advising email and more specific emails for international and incoming students.", emails: [{label: "International Students", email: "international@uni-ulm.de"}, {label: "Incoming Students", email: "incomings@uni-ulm.de"}, {label: "General Advising", email: "zentralestudienberatung@uni-ulm.de"}] },
        { name: "University of Mannheim", model: "Highly Personalized", model_cat: "Decentralized", details: "A highly personalized model providing a comprehensive list of staff members with direct emails for specific roles, such as degree-seeking students or international researchers.", emails: [{label: "Degree-Seeking Students", email: "vanessa.knies@mail-uni-mannheim.de"}, {label: "International Researchers", email: "martin.richter@mail-uni-mannheim.de"}] },
        { name: "University of Bonn", model: "Decentralized", model_cat: "Decentralized", details: "Operates with a decentralized model where different functions have their own emails, such as the International Service Point, the Student Registry, and general counseling.", emails: [{label: "International Service Point", email: "international@uni-bonn.de"}, {label: "Student Registry (Int.)", email: "intstud@verwaltung.uni-bonn.de"}, {label: "General Counseling", email: "study@uni-bonn.de"}] },
        { name: "Technical University of Berlin", model: "Centralized", model_cat: "Centralized", details: "A major technical university that likely operates a centralized International Office to manage a high volume of international inquiries. Inquiries are handled through a single, dedicated department.", emails: [{label: "International Office", email: "international@tu-berlin.de"}] },
        { name: "Ostwestfalen - Lippe University of Applied Sciences", model: "Hybrid", model_cat: "Hybrid", details: "As a university of applied sciences, it uses a hybrid approach, offering both a general International Office email and specific contacts for different programs or departments.", emails: [{label: "International Office", email: "international@th-owl.de"}] }
    ];

    // State hooks to manage the application's data and UI
    const [filteredUniversities, setFilteredUniversities] = useState(universityData);
    const [selectedModel, setSelectedModel] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [emailDraft, setEmailDraft] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Ref for the chart canvas to be used with Chart.js
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // Function to get a Tailwind CSS color class based on the model category
    const getModelColor = (model_cat) => {
        switch (model_cat) {
            case 'Centralized': return 'bg-sky-100 text-sky-800';
            case 'Decentralized': return 'bg-amber-100 text-amber-800';
            case 'Web-Centric': return 'bg-rose-100 text-rose-800';
            case 'Hybrid': return 'bg-lime-100 text-lime-800';
            case 'Specialized': return 'bg-violet-100 text-violet-800';
            default: return 'bg-stone-100 text-stone-800';
        }
    };

    // useEffect hook to filter universities whenever the selectedModel changes
    useEffect(() => {
        if (selectedModel === 'all') {
            setFilteredUniversities(universityData);
        } else if (selectedModel === 'Specialized') {
            // Special handling for the 'Specialized' category which includes multiple models
            const filtered = universityData.filter(uni => ['Two-Tiered', 'Dual Campus', 'Staff-Centric', 'Program-Specific', 'Role-Based'].includes(uni.model));
            setFilteredUniversities(filtered);
        } else {
            const filtered = universityData.filter(uni => uni.model_cat === selectedModel);
            setFilteredUniversities(filtered);
        }
    }, [selectedModel]);

    // useEffect hook to manage the Chart.js instance
    useEffect(() => {
        // Calculate model counts for the chart data
        const modelCounts = universityData.reduce((acc, uni) => {
            acc[uni.model_cat] = (acc[uni.model_cat] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(modelCounts);
        const dataValues = Object.values(modelCounts);

        if (chartInstance.current) {
            // If a chart instance already exists, destroy it to avoid memory leaks and conflicts
            chartInstance.current.destroy();
        }

        // Create a new Chart.js instance
        chartInstance.current = new Chart(chartRef.current, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Contact Models',
                    data: dataValues,
                    backgroundColor: [
                        '#a7f3d0', '#fde68a', '#fecaca', '#dcfce7', '#e9d5ff'
                    ],
                    borderColor: [
                        '#10b981', '#f59e0b', '#f43f5e', '#22c55e', '#8b5cf6'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.parsed}`
                        }
                    }
                }
            }
        });

        // Cleanup function to destroy the chart instance when the component unmounts
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    // Function to handle opening the modal and setting the selected university
    const openModal = (university) => {
        setSelectedUniversity(university);
        setIsModalOpen(true);
        setEmailDraft(''); // Reset email draft when opening a new modal
        setEmailSubject(''); // Reset email subject
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUniversity(null);
    };

    // Async function to generate an email draft using the Gemini API
    const generateEmailDraft = async () => {
        setIsLoading(true);
        setEmailDraft('Drafting email... ✨');
        setEmailSubject('Drafting subject...');

        const prompt = `You are an expert academic advisor. Draft a concise and polite email for a prospective international student. The email should be addressed to the International Office of a German university. The student is a prospective international student inquiring about programs and the application process. Keep the email formal and professional. The email should be general and applicable to any international student. Do not fill in the student's name, leaving a placeholder like [Your Name].

        University Name: ${selectedUniversity.name}
        Contact Model: ${selectedUniversity.model}
        Details: ${selectedUniversity.details}

        Please provide only the email text, starting with 'Subject:'.`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiKey = ""
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                // Split the response into subject and body
                const lines = text.split('\n');
                let subject = '';
                let body = '';

                if (lines[0].startsWith('Subject:')) {
                    subject = lines[0].replace('Subject:', '').trim();
                    body = lines.slice(1).join('\n').trim();
                } else {
                    body = text;
                }
                
                setEmailSubject(subject);
                setEmailDraft(body);
            } else {
                setEmailDraft('Error: Could not generate draft. Please try again.');
                setEmailSubject('Error Generating Email');
            }
        } catch (error) {
            console.error('API call failed:', error);
            setEmailDraft('Error: Failed to connect to the API. Please try again.');
            setEmailSubject('Error');
        } finally {
            setIsLoading(false);
        }
    };

    // A reusable card component for each university
    const UniversityCard = ({ university, onClick }) => (
        <div
            className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 cursor-pointer hover:shadow-md hover:border-teal-300 transition-all card-enter"
            onClick={() => onClick(university)}
        >
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-stone-900">{university.name}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getModelColor(university.model_cat)}`}>{university.model}</span>
            </div>
            <p className="text-sm text-stone-600 mt-2">{university.details.substring(0, 100)}...</p>
        </div>
    );

    // The modal component
    const UniversityModal = ({ isOpen, onClose, university, onGenerateEmail, emailDraft, emailSubject, isLoading }) => {
        if (!isOpen || !university) return null;

        const emailHtml = university.emails.length > 0
            ? university.emails.map(e => (
                <div key={e.email} className="flex items-center justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-600">{e.label}:</span>
                    <a href={`mailto:${e.email}`} className="font-medium text-teal-600 hover:underline">{e.email}</a>
                </div>
            ))
            : <p className="text-stone-600 text-center py-4">No direct email provided. Please refer to the university website or contact form.</p>;

        const openInMailClient = () => {
            const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailDraft)}`;
            window.open(mailtoLink, '_self');
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 text-3xl leading-none">&times;</button>
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">{university.name}</h2>
                    <div className="flex items-center mb-4">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getModelColor(university.model_cat)}`}>{university.model}</span>
                    </div>
                    <p className="text-stone-700 mb-6">{university.details}</p>
                    <h3 className="text-lg font-semibold text-stone-800 mb-3 border-t border-stone-200 pt-4">Contact Details</h3>
                    <div className="space-y-2">{emailHtml}</div>
                    
                    <h3 className="text-lg font-semibold text-stone-800 mb-3 border-t border-stone-200 pt-4">Email Assistant</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={onGenerateEmail} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-teal-700 transition-colors" disabled={isLoading}>
                            {isLoading ? 'Drafting...' : '✨ Draft Email'}
                        </button>
                        <button onClick={openInMailClient} className="bg-stone-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-stone-600 transition-colors" disabled={!emailDraft}>
                            Open in Mail Client
                        </button>
                    </div>
                    <div className="mt-4">
                        <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-sm text-stone-700 whitespace-pre-wrap">
                            {emailDraft || <p className="text-center text-stone-500 py-4">Click the button above to generate a draft email.</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-stone-50 text-stone-800 min-h-screen font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <header className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-stone-900">German University International Contact Navigator</h1>
                    <p className="mt-2 text-lg text-stone-600">An interactive guide to finding the right contact for international students.</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                            <h2 className="text-xl font-bold mb-4 text-stone-800">Filter by Contact Model</h2>
                            <div id="filters" className="space-y-2">
                                {['all', 'Centralized', 'Decentralized', 'Web-Centric', 'Hybrid', 'Specialized'].map(model => (
                                    <div key={model}>
                                        <label className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                name="contactModel"
                                                value={model}
                                                checked={selectedModel === model}
                                                onChange={() => setSelectedModel(model)}
                                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300"
                                            />
                                            <span>{model === 'all' ? 'All Models' : model}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                            <h2 className="text-xl font-bold mb-4 text-center text-stone-800">Contact Model Distribution</h2>
                            <div className="chart-container relative w-full h-72">
                                <canvas ref={chartRef}></canvas>
                            </div>
                            <p className="text-sm text-stone-500 mt-4 text-center">This chart illustrates the prevalence of different international student support structures.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                            <h2 className="text-xl font-bold mb-4 text-stone-800">Strategic Recommendations</h2>
                            <p className="text-sm text-stone-600 mb-4">Based on the analysis, here are the most effective strategies for contacting German universities.</p>
                            <ul className="space-y-3 text-stone-700">
                                <li className="flex items-start"><span className="text-teal-500 font-bold mr-2">🎯</span><div><strong>Target Your Inquiry:</strong> If a university offers specialized emails (e.g., for housing or admissions), always use them.</div></li>
                                <li className="flex items-start"><span className="text-teal-500 font-bold mr-2">🌐</span><div><strong>Navigate Actively:</strong> For universities without a clear contact email, actively search their website for "International Office."</div></li>
                                <li className="flex items-start"><span className="text-teal-500 font-bold mr-2">👤</span><div><strong>Check for Staff Directories:</strong> A personalized email to the right person can be very effective.</div></li>
                                <li className="flex items-start"><span className="text-teal-500 font-bold mr-2">✔️</span><div><strong>Verify the Institution:</strong> Always double-check that you are contacting the correct university.</div></li>
                            </ul>
                        </div>
                    </aside>

                    <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                        {filteredUniversities.map(uni => (
                            <UniversityCard key={uni.name} university={uni} onClick={openModal} />
                        ))}
                    </section>
                </main>
                <UniversityModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    university={selectedUniversity}
                    onGenerateEmail={generateEmailDraft}
                    emailDraft={emailDraft}
                    emailSubject={emailSubject}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default App;
