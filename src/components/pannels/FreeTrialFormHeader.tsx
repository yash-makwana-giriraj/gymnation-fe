import React, { useState } from 'react'
import Input from '../ui/Input';
import Button from '../ui/Button';
import SelectBox from '../ui/Select';
import { Option } from '@/interfaces/global';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const FreeTrialFormHeader = ({ title }: { title?: string }) => {
    const { cityLocations } = useSelector((state: RootState) => state.freeTrialForm);
    const [selectedCity, setSelectedCity] = useState<string>();
    const [selectedLocation, setSelectedLocation] = useState<string>();
    const [locations, setLocations] = useState<Option[]>([]);

    const handleCityClick = (cityValue: string) => {
        setSelectedCity(cityValue);

        const matchedCity = cityLocations.find(city => city.cityName === cityValue);

        const formatted: Option[] = matchedCity?.locations?.map(location => ({
            label: location,
            value: location
        })) || [];

        setLocations(formatted);
    };

    const handleLocationClick = (locationValue: string) => {
        setSelectedLocation(locationValue);
    };

    const cityOptions: Option[] = cityLocations.map(city => ({
        label: city.cityName,
        value: city.cityName,
    }));

    return (
        <section className="max-w-[1124px] w-full global-spacing free-trial-section !py-0 backdrop-blur-0">
            <div className="free-trial-in relative !z-1 bg-white border-[2px] border-solid border-[#022A3A] rounded-[24px] mx-auto my-0 max-w-[1454px] xlg:max-w-full overflow-hidden pt-[42px] px-[40px] lg:px-[160px] pb-[52px] w-[calc(100%-24px)] xs:w-[calc(100%-32px)] sm:w-[calc(100%-40px)] lp:w-[calc(100%-60px)] slg:w-[calc(100%-80px)]">
                <div className="container max-w-full w-full mb:max-w-[540px] xs:max-w-[720px] sm:max-w-[960px] lp:max-w-[1202px]">
                    <div className="mx-auto w-full sm:w-[776px] max-w-full text-[#022a3a]">
                        <div className="mb-[15px] mb:mb-[18px] sm:mb-[26px] text-center uppercase">
                            <h2 className="mb-[10px] text-[24px] mb:text-[30px] xs:text-[35px] sm:text-[45px] slg:text-[48px] font-extrabold leading-[32px] mb:leading-[40px] sm:leading-[55px] slg:leading-[60px] xs:mb-[10px] slg:mb-[8px]">
                                {title}
                            </h2>
                        </div>
                        <div className="w-[260px] mb:w-[360px] xs:w-[463px] sm:w-[563px] max-w-full my-0 mx-auto">
                            <form action="">
                                <div>
                                    <div>
                                        <div className="mb-[14px] xs:mb-[20px]">
                                            <SelectBox
                                                varient="trail"
                                                placeholder="SELECT A CITY"
                                                onChange={handleCityClick}
                                                value={selectedCity}
                                                options={cityOptions}
                                                className="!h-[34px] mb:!h-[44px] sm:!h-[46px] lp:!h-[50px] mb:!text-[16px]"
                                            />
                                        </div>
                                        {selectedCity && (
                                            <div className="mb-[14px] xs:mb-[20px]">
                                                <SelectBox
                                                    varient="trail"
                                                    placeholder="SELECT LOCATION"
                                                    onChange={handleLocationClick}
                                                    options={locations}
                                                    value={selectedLocation}
                                                    className="!h-[34px] mb:!h-[44px] sm:!h-[46px] lp:!h-[50px] mb:!text-[16px]"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-[14px] xs:mb-[20px]">
                                        <Input varient="trial" placeholder="FIRST NAME" />
                                    </div>
                                    <div className="mb-[14px] xs:mb-[20px]">
                                        <Input varient="trial" placeholder="EMAIL ADDRESS" />
                                    </div>
                                    <div className="mb-[14px] xs:mb-[20px]">
                                        <Input
                                            varient="trial"
                                            placeholder="PHONE (Eg 569462182)"
                                        />
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <Button
                                            variant='tangaroa'
                                            isArrow={false}
                                            className="!text-[15px] mb:!text-[16px] sm:!text-[20px] lp:!text-[24px] !leading-[19px] mb:!leading-[22px] sm:!leading-[24px] lp:!leading-[30px] mb:!min-w-[140px] sm:!min-w-[160px] lp:!min-w-[189px] text-white"
                                        >
                                            SUBMIT
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FreeTrialFormHeader