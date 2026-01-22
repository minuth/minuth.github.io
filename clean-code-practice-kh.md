# Clean Code and Software Design Principles
ការអនុវត្តសំខាន់ៗសម្រាប់ការសរសេរ Software ដែលងាយស្រួលអាន​ងាយថែទាំនិង scalable។

## ១. ការដាក់ឈ្មោះដែលមានអត្ថន័យ (Meaningful Names)
- ប្រើឈ្មោះដែលពិពណ៌នាបានច្បាស់លាស់សម្រាប់ variables, functions, classes និង modules។
- ប្រើប្រាស់ format ដែល consistent (ឧ. camelCase, PascalCase, snake_case)។

**ឧទាហរណ៍:**
```typescript
// Bad
const d = new Date();
const usr = getUsr();
function calc(a: number, b: number): number { return a * b * 0.15; }

// Good
const currentDate = new Date();
const activeUser = getActiveUser();
function calculateTaxAmount(price: number, quantity: number): number {
  const TAX_RATE = 0.15;
  return price * quantity * TAX_RATE;
}
```

## ២. Functions
- ផ្តោតលើកិច្ចការតែមួយ។
- ប្រើឈ្មោះដែលពិពណ៌នាពីគោលបំណងរបស់ function។
- ជៀសវាង​ nested functions ច្រើនពេក។
- ប្រើ​ object parameters ប្រសិនបើ function មាន parameters ច្រើន។

**ឧទាហរណ៍:**
```typescript
// Bad
class UserService {
  registerUser(user: User) {
    this.validate(user);
  }

  private validate(user: User) {
    if (!user.email) {
      throw new Error("Email required");
    }
    this.save(user);
  }

  private save(user: User) {
    // pretend DB save
    console.log("Saving user:", user.name);
    this.sendWelcome(user);
  }

  private sendWelcome(user: User) {
    console.log("Sending welcome email to:", user.email);
  }
}
// Good
class UserService {
  registerUser(user: User) {
    this.validate(user);
    this.save(user);
    this.sendWelcome(user);
  }

  private validate(user: User) {
    if (!user.email) {
      throw new Error("Email required");
    }
  }

  private save(user: User) {
    // pretend DB save
    console.log("Saving user:", user.name);
  }

  private sendWelcome(user: User) {
    console.log("Sending welcome email to:", user.email);
  }
}
```

## ៣. Comments (ការពន្យល់កូដ)
- ប្រើ comments ដើម្បីពន្យល់ code ដែលមិនច្បាស់លាស់។

## ៤. Flat is better than nested
- ជៀសវាង nested structures ដែលធ្វើឱ្យ code របស់អ្នកពិបាកអាន។
**ឧទាហរណ៍:**
```typescript
// Bad - Nested conditions
function validateUser(user: User) {
  if (user) {
    if (user.email) {
      if (user.age >= 18) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
// Good - Early returns to reduce nesting
function validateUser(user: User) {
  if (!user) return false;
  if (!user.email) return false;
  if (user.age < 18) return false;
  return true;
}
```

## ៥. គោលការណ៍ SOLID (SOLID Principles)

### Single Responsibility Principle (SRP)
Class ឬ function មួយគួរតែមានទំនួលខុសត្រូវតែមួយ។

**ឧទាហរណ៍:**

```typescript
// Bad - Single class with multiple responsibilities
class UserManager {
  // User-related responsibility
  createUser(name: string, email: string) {
    console.log(`User created: ${name}, ${email}`);
  }

  // Unrelated responsibility: file operations
  writeFile(content: string) {
    console.log(`Writing file with content: ${content}`);
  }

  // Unrelated responsibility: math utility
  calculateTax(amount: number) {
    return amount * 0.1;
  }
}

// Good - Separate classes for each responsibility
class UserService {
  createUser(name: string, email: string) {
    console.log(`User created: ${name}, ${email}`);
  }
}
class FileService {
  writeFile(content: string) {
    console.log(`Writing file with content: ${content}`);
  }
}
class TaxCalculator {
  calculateTax(amount: number) {
    return amount * 0.1;
  }
}
```

### Open/Closed Principle (OCP)
បើកសម្រាប់ការបន្ថែម (extension) ប៉ុន្តែបិទសម្រាប់ការកែប្រែ (modification)។

**ឧទាហរណ៍:**
```typescript
// Bad - Modifying existing code to add new shapes
class AreaCalculator {
    calculateArea(shape: any): number {
        if (shape.type === "circle") {
            return Math.PI * shape.radius * shape.radius;
        } else if (shape.type === "rectangle") {
            return shape.width * shape.height;
        }
        // Adding new shapes requires modifying this method
    }
}

// Good - Extending functionality without modifying existing code
interface Shape {
    area(): number;
}
class Circle implements Shape {
    constructor(private radius: number) {}
    area(): number {
        return Math.PI * this.radius * this.radius;
    }
}
class Rectangle implements Shape {
    constructor(private width: number, private height: number) {}
    area(): number {
        return this.width * this.height;
    }
}
class AreaCalculator {
    calculateArea(shape: Shape): number {
        return shape.area();
    }
}
```

### Liskov Substitution Principle (LSP)
Derived classes ត្រូវតែអាចជំនួស base classes បាន។

**ឧទាហរណ៍:**
```typescript
// Bad - Subclass that violates LSP
class Bird {
    fly(): void {
        console.log("Flying");
    }
}
class Ostrich extends Bird {
    fly(): void {
        throw new Error("Ostriches can't fly!");
    }
}
// Good - Separate hierarchy for non-flying birds
class Bird {
    eat(): void {
        console.log("Eating");
    }
}

class FlyingBird extends Bird {
    fly(): void {
        console.log("Flying");
    }
}
class Ostrich extends Bird {
    // Ostrich does not have fly method
}
```

### Interface Segregation Principle (ISP)
កុំបង្ខំឱ្យ client ពឹងផ្អែកលើ interfaces ដែលពួកគេមិនប្រើ។

**ឧទាហរណ៍:**
```typescript
// Bad - Fat interface
interface Worker {
    work(): void;
    eat(): void;
}
class HumanWorker implements Worker {
    work(): void {
        console.log("Working");
    }
    eat(): void {
        console.log("Eating");
    }
}
class RobotWorker implements Worker {   
    work(): void {
        console.log("Working");
    }
    // Robot does not eat, but forced to implement eat()
    eat(): void {
        throw new Error("Robots don't eat!");
    }
}

// Good - Segregated interfaces
interface Workable {
    work(): void;
}
interface Eatable {
    eat(): void;
}
class HumanWorker implements Workable, Eatable {
    work(): void {
        console.log("Working");
    }
    eat(): void {
        console.log("Eating");
    }
}
class RobotWorker implements Workable {   
    work(): void {
        console.log("Working");
    }
}
```

### Dependency Inversion Principle (DIP)
ពឹងផ្អែកលើ abstractions ជំនួស concretions។

**ឧទាហរណ៍:**

```typescript
// Bad - High-level module depends on low-level module
class MySQLDatabase {
    connect(): void {
        console.log("Connected to MySQL");
    }
}
class UserService {
    private database: MySQLDatabase;
    constructor() {
        this.database = new MySQLDatabase();
    }
    getUser(): void {
        this.database.connect();
        console.log("Fetching user");
    }
}

// Good - Both high-level and low-level modules depend on abstractions
interface Database {
    connect(): void;
}
class MySQLDatabase implements Database {
    connect(): void {
        console.log("Connected to MySQL");
    }
}
class PostgreSQLDatabase implements Database {
    connect(): void {
        console.log("Connected to PostgreSQL");
    }
}
class UserService {
    private database: Database;
    constructor(database: Database) {
        this.database = database;
    }
    getUser(): void {
        this.database.connect();
        console.log("Fetching user");
    }
}
// Usage
new UserService(new MySQLDatabase())
new UserService(new PostgreSQLDatabase())
```

## ៦. Clean Architecture
- **Layer Separation**: បំបែក Layers ទៅតាមតួនាទី (e.g.,​ Service, Repository, Controller)។
- **Dependency Rule**: អនុវត្តតាម Dependency Inversion Principle ដើម្បីធានាថា high-level modules មិនពឹងផ្អែកលើ low-level modules ទេ។ 
- **Independence**: Business logic មិនពឹងផ្អែកលើ frameworks, UI, ឬ databases។
- **Testability**: អាចធ្វើតេស្តបានយ៉ាងងាយស្រួលដោយមិនមាន dependencies ខាងក្រៅ។

**ឧទាហរណ៍ (Layered Architecture):**
```typescript
// Domain Layer
class User {
    constructor(public id: number, public name: string) {}
}
interface UserRepository {
    getUserById(id: number): User;
}

class InMemoryUserRepository implements UserRepository {
    private users: User[] = [new User(1, "Alice"), new User(2, "Bob")];
    getUserById(id: number): User {
        return this.users.find(user => user.id === id);
    }
}

// Application Layer
class UserService {
    constructor(private userRepository: UserRepository) {}
    getUserProfile(id: number): User {
        return this.userRepository.getUserById(id);
    }
}

class UserController {
    constructor(private userService: UserService) {}
    getUserProfile(id: number): void {
        const user = this.userService.getUserProfile(id);
        console.log(`User Profile: ${user.name}`);
    }
}
// Usage
const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
userController.getUserProfile(1);
```