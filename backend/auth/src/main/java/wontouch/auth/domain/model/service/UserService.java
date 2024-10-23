package wontouch.auth.domain.model.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wontouch.auth.domain.dto.UserDto;
import wontouch.auth.domain.entity.User;
import wontouch.auth.global.exception.CustomException;
import wontouch.auth.global.exception.ExceptionResponse;
import wontouch.auth.domain.model.repository.UserRepository;
import wontouch.auth.global.util.jwt.JwtProvider;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    public UserDto getUserDto(String accessToken) {
        User user = userRepository.findById(getUserId(accessToken))
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getEmail());

        return userDto;
    }

    public int getUserId(String accessToken) {
        Integer userId = jwtProvider.getAuthentication(accessToken);

        if (userId == null)
            throw new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION);

        return userId;
    }

    public String getUserEmail(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        return user.getEmail();
    }

    public void deleteUser(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        userRepository.delete(user);
    }
}
