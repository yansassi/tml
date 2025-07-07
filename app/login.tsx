import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, Lock, Heart, Gamepad2 } from 'lucide-react-native';
import { router } from 'expo-router';

interface LoginFormData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  error?: string;
}

export default function LoginScreen() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  // Função para validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar formulário
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Senha deve ter pelo menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para simular login (futura integração com banco de dados)
  const authenticateUser = async (email: string, password: string): Promise<AuthResponse> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simula validação de credenciais
    // Em produção, isso seria uma chamada para sua API/banco de dados
    if ((email === 'admin' && password === 'admin') || 
        (email === 'demo@mlmatch.com' && password === 'demo123')) {
      return {
        success: true,
        user: {
          id: '1',
          email: email,
          name: email === 'admin' ? 'Administrator' : 'Demo User'
        },
        token: 'jwt_token_here'
      };
    }

    return {
      success: false,
      error: 'Email ou senha incorretos'
    };
  };

  // Função para lidar com o login
  const handleLogin = async () => {
    // Para admin/admin, pula a validação de email
    if (formData.email === 'admin' && formData.password === 'admin') {
      setIsLoading(true);
      try {
        const response = await authenticateUser(formData.email, formData.password);
        if (response.success) {
          router.replace('/(tabs)');
        }
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authenticateUser(formData.email, formData.password);

      if (response.success && response.user && response.token) {
        // Aqui você salvaria o token e dados do usuário
        // Por exemplo: AsyncStorage, SecureStore, ou context
        console.log('Login successful:', response.user);
        console.log('Token:', response.token);

        // Navegar para a tela principal
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erro de Login', response.error || 'Falha na autenticação');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com "Esqueci minha senha"
  const handleForgotPassword = () => {
    if (!formData.email) {
      Alert.alert('Email necessário', 'Digite seu email primeiro para recuperar a senha.');
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Email inválido', 'Digite um email válido para recuperar a senha.');
      return;
    }

    // Aqui você implementaria a lógica de recuperação de senha
    Alert.alert(
      'Email enviado',
      `Instruções de recuperação foram enviadas para ${formData.email}`,
      [{ text: 'OK' }]
    );
  };

  // Função para navegar para tela de cadastro
  const handleSignUp = () => {
    // Futura implementação da tela de cadastro
    Alert.alert(
      'Cadastro',
      'Tela de cadastro será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  // Função para login com Google (futura implementação)
  const handleGoogleLogin = () => {
    Alert.alert(
      'Login com Google',
      'Integração com Google será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header com Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#FF4458', '#FF8A00']}
                style={styles.logoGradient}
              >
                <Heart size={32} color="#ffffff" fill="#ffffff" />
                <Gamepad2 size={28} color="#ffffff" />
              </LinearGradient>
            </View>
            <Text style={styles.appName}>ML Match</Text>
            <Text style={styles.tagline}>Encontre seu duo perfeito</Text>
          </View>

          {/* Formulário de Login */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>
            <Text style={styles.welcomeSubtitle}>
              Entre na sua conta para continuar sua jornada
            </Text>

            {/* Campo de Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="seu@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, email: text }));
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Campo de Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Sua senha"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, password: text }));
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Link Esqueci minha senha */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {/* Botão de Login */}
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#9CA3AF', '#6B7280'] : ['#FF4458', '#FF8A00']}
                style={styles.loginGradient}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botão Google */}
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=40&h=40' }}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Continuar com Google</Text>
            </TouchableOpacity>

            {/* Link para Cadastro */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#FF4458',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF4458',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginHorizontal: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    borderRadius: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF4458',
  },
});