import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import LinkedinBlue from '../../../public/icons/Linkedin-blue.svg'
import FacebookBlue from '../../../public/icons/Facebook-blue.svg'
import XBlue from '../../../public/icons/X-blue.svg'
import { FooterData } from '@/interfaces/content';
import { apiBaseUrl } from '@/api-handler/axios-handler';
import parse from "html-react-parser";

const Footer = ({ data }: { data: FooterData }) => {
  return (
    <footer className="bg-basic-inverse text-accent-primary text-sm py-[48px] md:py-[80px] px-[0px] md:px-0 ">
      <div className="max-w-[1296px] mx-auto px-[24px] mb-[40px] flex flex-wrap lg:flex-nowrap gap-[40px]">
        <div className="flex-[31%] ">
          {data?.footerLogo?.[0]?.url &&
            <Image src={`${apiBaseUrl}${data?.footerLogo?.[0]?.url}`} alt="OQ8 Logo" width={188} height={33}  className="w-[155px] h-[27px] md:w-[188px] md:h-[33px] mb-[24px]" />
          }
          {data?.footerDescription &&
            <div className='body2-regular pe-[0px] md:pe-[80px]'>
              {parse(data?.footerDescription)}
            </div>
          }
        </div>

        <div className='flex-[69%] flex flex-wrap gap-x-[16px] lg:gap-x-[24px] gap-y-[40px]'>
              {data?.footerNavigation?.items.map((item, index) => {
                const dataContent = item.content.properties
                return (
                  dataContent.links ?
                    <div key={index} className={`min-w-[155px] lg:min-w-[188px] ${index === 4 && "md:col-start-3"} ${index > 3 && ""}`}>
                      <ul className="space-y-[5px] body2-regular">
                        {dataContent.links.map((data, index) => {
                          return (
                            <li key={index} className={`${index === dataContent.links!.length - 1 ? "mb-[0px]" : "mb-[16px]"} ${index === 0 ? "body1-medium" : "body2-regular"}`}><Link href={data.url}>{data.title}</Link></li>
                          )
                        })}
                      </ul>
                    </div >
                    :
                    <div key={index} className='min-w-[155px] lg:min-w-[188px]'>
                      <h4 className="body1-medium mb-[16px]">{dataContent.heading}</h4>
                      {(typeof dataContent.description) !== 'string' &&
                        <div className='body2-regular'>{parse(dataContent.description.markup)}</div>
                      }
                    </div>
                )
              }
              )}
        </div>

      </div >

      <div className='max-w-[1296px] mx-auto px-[24px]'>
        <div className="flex items-center gap-[24px] mt-0 md:mt-0 mb-[24px]">
          {data?.footerSocialMedia?.items.map((item, index) => {
            const dataContent = item.content.properties;

            const socialMediaIcons = {
              LinkedIn: LinkedinBlue,
              Facebook: FacebookBlue,
              Twitter: XBlue,
            };

            const icon = socialMediaIcons[dataContent.socialMedia as keyof typeof socialMediaIcons];

            return icon ? (
              <Link key={index} href={dataContent.link[0].url}>
                <Image
                  src={icon}
                  alt={`${dataContent.socialMedia} icon`}
                />
              </Link>
            ) : null;
          })}
        </div>
        <hr className='text-accent-primary'/>
      </div>

      <div className=" mt-[24px]">
        <div className="max-w-[1296px] mx-auto px-[24px] flex flex-col md:flex-row justify-between items-start  text-sm gap-2">
          <div className="flex gap-4">
            <span className="body2-regular">{data.copyrightText}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer