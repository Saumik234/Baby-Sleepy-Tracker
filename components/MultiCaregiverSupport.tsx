import React, { useState, useEffect } from 'react';

interface Caregiver {
    id: string;
    email: string;
    status: 'Accepted' | 'Pending';
}

interface MultiCaregiverSupportProps {
    onBack: () => void;
}


const MultiCaregiverSupport: React.FC<MultiCaregiverSupportProps> = ({ onBack }) => {
    const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        try {
            const savedCaregivers = localStorage.getItem('caregivers');
            if (savedCaregivers) {
                setCaregivers(JSON.parse(savedCaregivers));
            } else {
                 // Add the current user as the admin by default
                setCaregivers([{ id: 'admin-user', email: 'you@example.com (Admin)', status: 'Accepted' }]);
            }
        } catch (err) {
            console.error("Failed to load caregivers from localStorage", err);
        }
    }, []);

    const saveCaregivers = (newCaregivers: Caregiver[]) => {
        setCaregivers(newCaregivers);
        localStorage.setItem('caregivers', JSON.stringify(newCaregivers));
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (caregivers.some(c => c.email.toLowerCase() === email.toLowerCase())) {
            setError('This email has already been invited.');
            return;
        }

        const newCaregiver: Caregiver = {
            id: crypto.randomUUID(),
            email,
            status: 'Pending',
        };
        saveCaregivers([...caregivers, newCaregiver]);
        setSuccessMessage(`An invitation has been sent to ${email}. They will be marked as 'Pending' until they accept.`);
        setEmail('');
    };

    const handleRemove = (id: string) => {
        if (id === 'admin-user') {
            alert("You cannot remove the admin.");
            return;
        }
        if (window.confirm("Are you sure you want to remove this caregiver?")) {
            const caregiverToRemove = caregivers.find(c => c.id === id);
            const remainingCaregivers = caregivers.filter(c => c.id !== id);
            saveCaregivers(remainingCaregivers);

            if (caregiverToRemove) {
                setSuccessMessage(`Caregiver '${caregiverToRemove.email}' has been removed.`);
                setError(''); // Clear any previous errors
            }
        }
    };


    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <p className="text-gray-600 mb-6">Invite your partner, family, or nanny to share and update baby logs in real-time. Everyone stays in sync!</p>
            
            <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Invite a New Caregiver</h3>
                <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                            setSuccessMessage('')
                        }}
                        placeholder="Enter email address"
                        className="flex-grow px-4 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm focus:outline-none focus:ring-0"
                    />
                    <button type="submit" className="bg-[#A18AFF] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#866de6] transition-colors">
                        Send Invite
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shared Access List</h3>
                <div className="border border-gray-200 rounded-lg">
                    {caregivers.length > 0 ? (
                        caregivers.map(caregiver => (
                            <div key={caregiver.id} className="flex justify-between items-center p-4 border-b last:border-b-0">
                                <div>
                                    <p className="font-medium text-gray-800">{caregiver.email}</p>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${caregiver.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {caregiver.status}
                                    </span>
                                </div>
                                {caregiver.id !== 'admin-user' && (
                                    <button onClick={() => handleRemove(caregiver.id)} className="text-sm text-red-600 hover:text-red-800 font-medium">
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-gray-500">No caregivers have been invited yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultiCaregiverSupport;