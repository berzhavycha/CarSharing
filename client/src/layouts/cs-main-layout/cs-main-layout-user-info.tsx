import { useStore } from "@/context";
import { FC } from "react";
import styled from "styled-components";

import DefaultImage from '../../../public/avatar.webp';
import { AdvancedImage, lazyload, placeholder } from "@cloudinary/react";
import { observer } from "mobx-react-lite";
import { Resize } from "@cloudinary/url-gen/actions";
import { cld } from "@/app/cloudinary";
import { Quality } from "@cloudinary/url-gen/qualifiers";

export const CSMainLayoutUserInfo: FC = observer(() => {
    const {
        currentUserStore: { user },
    } = useStore();

    const cloudinaryImage = user?.avatar
        ? cld
            .image(user.avatar.publicId)
            .resize(Resize.fill().width(50).height(50))
            .quality(Quality.auto())
        : null;

    return (
        <>
            <UserAvatarWrapper>
                {cloudinaryImage ? (
                    <AdvancedImage
                        cldImg={cloudinaryImage}
                        plugins={[lazyload(), placeholder({ mode: 'blur' })]}
                        alt="User Avatar"
                    />
                ) : (
                    <img src={DefaultImage} alt="Default Avatar" />
                )}
            </UserAvatarWrapper>
            {user && (
                <UserDetails>
                    <p>{user?.firstName} {user?.lastName}</p>
                    <Balance>Balance: ${user?.balance?.toFixed(2)}</Balance>
                </UserDetails>
            )}
        </>
    )
})

const UserAvatarWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;

  img, .cloudinary-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Balance = styled.h4`
  font-size: 14px;
  margin: 0;
`;
