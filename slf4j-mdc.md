# SLF4J MDC Logger
MDC (Mapped Diagnostic Context) is a feature of SLF4J that allows you to add context information to your log messages.

## Usage
```java
MDC.put("key", "value");
logger.info("message");
MDC.remove("key");
```

## Enable MDC in Logback
Update your logback.xml file to include the MDC context in the log pattern.
```xml
<pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %X{exampleMDCKey} - %msg%n</pattern>
```

## Enable MDC in Log4j2
Update your log4j2.xml file to include the MDC context in the log pattern.
```xml
<pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %X{exampleMDCKey} - %msg%n</pattern>
```

## Add Global MDC Filter in Spring Boot
### Create a filter class.
```java
public class MdcFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            // 1. Setup MAIN thread context
            String traceId = UUID.randomUUID().toString();
            HttpServletRequest httpServletRequest = (HttpServletRequest) request;
            MDC.put("method", httpServletRequest.getMethod());
            MDC.put("uri", httpServletRequest.getRequestURI());
            MDC.put("traceId", traceId);

            chain.doFilter(request, response);
        } finally {
            // 2. Clear MAIN thread context
            // This is vital to prevent context leaking to the next HTTP request
            MDC.clear();
        }
    }
}
```
The above code will add the following context to your log messages:
- method: The HTTP method of the request.
- uri: The URI of the request.
- traceId: A unique identifier for the request.

### Register the filter in your Spring Boot application.
```java
@Configuration
public class FilterConfig {
    @Bean
    public FilterRegistrationBean<MdcFilter> loggingFilter() {
        FilterRegistrationBean<MdcFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new MdcFilter());
        registrationBean.addUrlPatterns("/*");
        // set filter to high priority
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registrationBean;
    }
}
```
### Add individual MDC context in your code.
To keep the log easy to read and filterable, we can add context to specific parts of the code. Example we want to add the user id to every log message in a specific method or API.
```java
@RestController
@RequestMapping("/api/users")
class UserController {
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        final String context = String.format("(userId=%s)", id);
        MDC.put("context", context);
        logger.info("getUser started");
        // do something
        logger.info("getUser finished");
        return ResponseEntity.ok().build();
    }
}
```
### Add Global MDC Context and Individual MDC Context in your log pattern
```xml
<pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - [traceId=%X{traceId}, uri=%X{uri}, method=%X{method}, context=%X{context}] - %msg%n</pattern>
```
Example output:
```
2026-02-06 00:19:54 [http-nio-8080-exec-1] INFO  c.p.b.c.UserController - [traceId=123e4567-e89b-12d3-a456-426614174000, uri=/api/users/1, method=GET, context=(userId=1)] - getUser started
2026-02-06 00:19:54 [http-nio-8080-exec-1] INFO  c.p.b.c.UserController - [traceId=123e4567-e89b-12d3-a456-426614174000, uri=/api/users/1, method=GET, context=(userId=1)] - getUser finished
```