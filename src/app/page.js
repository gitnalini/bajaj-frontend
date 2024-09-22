"use client";
import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState(null);
    const [getResponse, setGetResponse] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        try {
            const jsonData = JSON.parse(input);
            const res = await axios.post('https://bajaj-api-n7tg.onrender.com/bfhl', jsonData);
            setResponse(res.data);
            setError(null);
        } catch (err) {
            setError('Invalid JSON input or server error');
        }
    };

    const handleGetRequest = async () => {
        try {
            const res = await axios.get('https://bajaj-api-n7tg.onrender.com/bfhl');
            setGetResponse(res.data);
            setError(null);
        } catch (err) {
            setError('GET request failed');
        }
    };

    const handleFilter = (type) => {
        setSelectedFilters(prevFilters =>
            prevFilters.includes(type)
                ? prevFilters.filter(f => f !== type)
                : [...prevFilters, type]
        );
    };

    const getFilteredResponse = () => {
        if (!response) return null;
        const filteredResponse = {};
        if (selectedFilters.includes('Numbers')) filteredResponse.numbers = response.numbers;
        if (selectedFilters.includes('Alphabets')) filteredResponse.alphabets = response.alphabets;
        if (selectedFilters.includes('Highest lowercase alphabet')) filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
        return filteredResponse;
    };

    const filteredResponse = getFilteredResponse();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full">
                <h1 className="text-4xl font-semibold mb-6 text-center text-blue-600">API Data Processor</h1>
                <textarea
                    rows="5"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste your JSON input here"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Submit JSON (POST Request)
                </button>

                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

                {response && (
                    <>
                        <h2 className="text-2xl font-semibold mt-6">Filters</h2>
                        <div className="flex justify-center space-x-3 mt-4 mb-5">
                            {['Numbers', 'Alphabets', 'Highest lowercase alphabet'].map((filter) => (
                                <button
                                    key={filter}
                                    className={`px-4 py-2 rounded-lg transition duration-200 ${
                                        selectedFilters.includes(filter) ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                    }`}
                                    onClick={() => handleFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <h3 className="text-xl font-semibold">Filtered Response</h3>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                            {JSON.stringify(filteredResponse, null, 2)}
                        </pre>
                    </>
                )}

                <button
                    onClick={handleGetRequest}
                    className="mt-6 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                >
                    Fetch Data (GET Request)
                </button>

                {getResponse && (
                    <>
                        <h3 className="text-xl font-semibold mt-4">GET Response Data:</h3>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                            {JSON.stringify(getResponse, null, 2)}
                        </pre>
                    </>
                )}
            </div>
        </div>
    );
}
