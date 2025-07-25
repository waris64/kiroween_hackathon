import Indonesia from '/src/assets/Indonesia.jpg'
import Malaysia  from '/src/assets/Malaysia.jpg'
import france  from '/src/assets/France.jpg'
const RecentTrips = (props) =>{
    return(
        <div className='md:pt-24 pt-20'>
            <h1 className='text-center text-4xl pt-10 font-bold pt-4 '>Recent Trips</h1>
            <p className='text-center text-2xl '>You can discover unique destinations using Google Maps.</p>
            <div className='multiple-destinations flex flex-col md:flex-row pt-10 gap-x-5 '>
                <div className="max-w-sm rounded shadow-lg p-4">
                    <div className='transition-transform duration-300 F  overflow-hidden delay-10 cursor-pointer'>
                        <img className="w-full h-56 object-cover rounded transition-transform duration-300 hover:scale-125" src={Indonesia} alt="Sunset in the mountains" />
                    </div>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Trip in Indonesia</div>
                        <p className="text-gray-700 text-base">
                            Indonesia, officially the Republic of Indonesia, is a country in Southeast Asia and Oceania between the Indian and Pacific oceans. It consists of over 17,000 islands, including Sumatra, Java, Sulawesi, and parts of Borneo and New Guinea.
                        </p>
                    </div>
                </div>
                <div className="max-w-sm rounded shadow-lg p-4">
                    <div className='transition-transform duration-300 F  overflow-hidden delay-10 cursor-pointer'>
                        <img className="w-full h-56 object-cover rounded transition-transform duration-300 hover:scale-125" src={Malaysia} alt="Sunset in the mountains" />
                    </div>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Trip in Malaysia</div>
                        <p className="text-gray-700 text-base">
                            Malaysia is a Southeast Asian country occupying parts of the Malay Peninsula and the island of Borneo. It's known for its beaches, rainforests and mix of Malay, Chinese, Indian and European cultural influences.
                        </p>
                    </div>
                </div>
                <div className="max-w-sm rounded shadow-lg p-4">
                    <div className='transition-transform duration-300 F  overflow-hidden delay-10 cursor-pointer'>
                        <img className="w-full h-56 object-cover rounded transition-transform duration-300 hover:scale-125" src={france} alt="Sunset in the mountains" />
                    </div>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Trip in France</div>
                        <p className="text-gray-700 text-base">
                            France, in Western Europe, encompasses medieval cities, alpine villages and Mediterranean beaches. Paris, its capital, is famed for its fashion houses, classical art museums including the Louvre and monuments like the Eiffel Tower.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RecentTrips